const userID = "tesla@gmail.com";

async function postInfo(url, data){
    const res = await fetch(url, 
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data
        })
    })

    const response = await res.json();
    return response;
}



class chatRoom{ 
    constructor(roomNameInput, roomDescriptionInput, currID){
        const mask = document.querySelector(".page-mask");
        const newRoomPopup = document.querySelector(".new-room-popup");

        //Remove mask
        mask.style.display = "none";
        newRoomPopup.style.display = "none";

        //Initialising the variable
        this.roomNameInput = roomNameInput;
        this.roomDescriptionInput = roomDescriptionInput;

        this.messages = [];
        this.users = [["You(admin)", "owner"]];
        this.id = currID;

        this.displayRoom();
    }


    //Select a room
    selectRoom(roomDiv){
        console.log("selecting room");
        const roomLI = roomDiv.parentNode;
        const selectedRoom = document.querySelector('.selected');
        if (selectedRoom == roomLI){
            return;
        }

        if(selectedRoom){
            selectedRoom.classList.remove("selected");
        }

        roomLI.classList.add("selected");
        postInfo("/getData", [roomLI.id])
        .then((chatroomsData) => {
            this.messages = chatroomsData.messages;
            this.users = [["You(admin)", "owner"], ...chatroomsData.users];

            this.showMessages();
            this.showUsers();
        });

        this.roomDescriptionDiv.innerText = this.roomDescriptionInput;

        const chatTable = document.querySelector('table');  
        chatTable.innerHTML = "";

        const messagePlaceholder = document.querySelector("textarea");
        messagePlaceholder.placeholder = `Type your Message in "${this.roomNameInput}" room`;
        
        
        const userUL = document.querySelector(".user-list");
        userUL.innerHTML = "";

        const addUser = document.querySelector(".add-user-button");
        addUser.style.display = "initial";
    }


    //Show room in list
    displayRoom(){
        let roomName = document.createElement("div");
        roomName.classList.add("room");
        roomName.innerText = this.roomNameInput;

        this.roomDescriptionDiv = document.querySelector(".description");
        this.roomDescriptionDiv.innerText = this.roomDescriptionInput;

        let deleteRoomButton = document.createElement("button");
        deleteRoomButton.classList.add("delete-room");

        let deleteIcon = document.createElement("img");
        deleteIcon.src = "assets/skull.png";
        deleteIcon.style.alt = "delete";
        deleteIcon.classList.add("delete-icon");

        deleteRoomButton.append(deleteIcon);

        let roomLi = document.createElement("li");
        roomLi.classList.add("room-name");
        roomLi.id = this.id;
        roomLi.append(roomName, deleteRoomButton);

        const roomListUl = document.querySelector("ul.room-list");
        roomListUl.append(roomLi);

        roomName.addEventListener('click', () => {
            this.selectRoom(roomName);
        })

        deleteRoomButton.addEventListener('click', () => {
            this.deleteRoom(deleteRoomButton);
        })
    }


    //Delete a room
    deleteRoom(deleteButton){
        const remove = deleteButton.parentNode;   
        remove.remove();

        this.roomDescriptionDiv.innerText = "";
        const chatTable = document.querySelector('table');        
        chatTable.innerHTML = "";

        const messagePlaceholder = document.querySelector("textarea");
        messagePlaceholder.placeholder = "Please select a chat room to message in";

        postInfo("/deleteRoom", [remove.id]);

        const userUL = document.querySelector(".user-list");
        userUL.innerHTML = "";
    }


    createMessageRow(messageList){
        const chatTable = document.querySelector('table');
        const chatDiv = document.querySelector('.chat');

        const newRow = document.createElement("tr");
        
        const name = document.createElement("th");
        name.innerText = messageList[0];
    
        const message = document.createElement("td");
        message.innerText = messageList[1];
        message.classList.add("message-content");
    
        const dateSpan = document.createElement("span");
        dateSpan.innerText = messageList[2];
        dateSpan.classList.add("date")
        const timeSpan = document.createElement("span");
        timeSpan.innerText = messageList[3];
        timeSpan.classList.add("time");
    
        const messageTime = document.createElement("td");
        const br = document.createElement("br");
        messageTime.classList.add('sent-time');
        messageTime.append(dateSpan, br, timeSpan);
    
        newRow.append(name, message, messageTime);
        chatTable.appendChild(newRow);
    
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }


    //Show messages for a room
    showMessages(){
        let messagesList = this.messages;

        for (var messageList of messagesList){
            this.createMessageRow(messageList);
        }
    }


    //Send messages in a room
    sendMessage(){
        console.log(this.messages);
        let currentDate;

        let messageText = messageBox.value;
        if (messageText != ""){
            messageBox.value = "";
        
            currentDate = new Date(); 
            let month = currentDate.toLocaleString('default', { month: 'short' });
            let date = `${month} ${currentDate.getDate()}`;
            let currentTime = `${currentDate.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

            const selectedRoom = document.querySelector('.selected');
            console.log(this.messages);
            this.messages.push([currUser.username, messageText, date, currentTime]);

            postInfo("/postMessage", [messageText, currUser.email, selectedRoom.id]);
            
            this.createMessageRow([currUser.username, messageText, date, currentTime]);
        }
    }


    createUserRow(username, role){
        const userUL = document.querySelector(".user-list");

        const userLI = document.createElement("li");
        userLI.classList.add(role);
        userLI.innerText = username;

        userUL.appendChild(userLI);
    }


    showUsers(){
        let userList = this.users;
        for (var user of userList){
            this.createUserRow(user[0], user[1]);
        }
    }


    //Add a new user to the room
    addNewUser(){
        const username = document.querySelector("#new-username").value;
        const role = document.querySelector("#roles").value;
        const selectedRoom = document.querySelector('.selected');

        const mask = document.querySelector(".page-mask");
        const addUserPopup = document.querySelector(".add-user-popup");


        this.users.push([username, role]);
        console.log(this.users);
        
        let statusPromise = postInfo("/addUser", [username, selectedRoom.id, role])
        .then((status) => {
            return status;
        });

        const status = async () => {
            const currStatus = await statusPromise;

            if (currStatus.status == "no user"){
                mask.style.display = "none";
                addUserPopup.style.display = "none";
                alert("There is no user with this email ID");
            } else if (currStatus.status == "user already exists"){
                mask.style.display = "none";
                addUserPopup.style.display = "none";
                alert("This user already exists in this room");
            } else{
                mask.style.display = "none";
                addUserPopup.style.display = "none";
                this.createUserRow(currStatus.username, role);
            }
        };
        status();
    }
}

window.ChatRoom = chatRoom;
