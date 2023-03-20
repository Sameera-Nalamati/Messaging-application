let Chatrooms = {};


function fetchData(){
    const roomListUl = document.querySelector("ul.room-list")
    roomListUl.innerHTML = "";

    return new Promise((resolve, reject) => {
        fetch('/chatroomsData')
        .then(response => response.json())
        .then(chatroomsData => {
            Chatrooms = {};
            for (let room of Object.keys(chatroomsData)){
                let currRoom = chatroomsData[room]
                Chatrooms[room] = new chatRoom(currRoom["name"], currRoom["description"], room);
            };

            return resolve(Chatrooms);
        })
        .catch(error => {
            return reject(error);
        });
    })
}

fetchData();


// setInterval(() => {
//     let selectedRoom = document.querySelector('.selected'); 

//     fetchData(Chatrooms)
//     .then(() => {
//         if (selectedRoom){
//             console.log(selectedRoom);
//             Chatrooms[selectedRoom.id].selectRoom(selectedRoom.firstChild);
//             console.log(Chatrooms[selectedRoom.id]);
//         }
//     })
    
//     console.log(Chatrooms);
// }, 60000)




//Add a new user
const addUser = document.querySelector("#add-user");
addUser.addEventListener("click", function(e){
    e.preventDefault();

    const selectedRoom = document.querySelector('.selected');
    console.log(Chatrooms);
    console.log(selectedRoom.id);
    Chatrooms[selectedRoom.id].addNewUser();
})


//Show room popup
const addRoomButtom = document.querySelector("#add-room");
const mask = document.querySelector(".page-mask");
const newRoomPopup = document.querySelector(".new-room-popup");

addRoomButtom.addEventListener("click", function(){
    mask.style.display = "initial";
    newRoomPopup.style.display = "initial";
})

//Show new user popup
const addUserButton = document.querySelector(".add-user-button");
const addUserPopup = document.querySelector(".add-user-popup");

addUserButton.addEventListener('click', function(e){
    e.preventDefault();
    mask.style.display = "initial";
    addUserPopup.style.display = "initial";
})


//Cancel popup
const cancelRoomButtom = document.querySelector("#cancel-room");

cancelRoomButtom.addEventListener("click", function(e){
    e.preventDefault();

    mask.style.display = "none";
    newRoomPopup.style.display = "none";
})



//Create a new room
const createButton = document.querySelector("#create-room");
createButton.addEventListener("click", function(e) {
    e.preventDefault();
    
    var roomNameInput = document.querySelector("#new-room-name");
    var roomDescriptionInput = document.querySelector("#new-room-description");

    if (roomNameInput.value == ""){
        roomNameInput.classList.add("error");
        setTimeout(function() {
            roomNameInput.classList.remove('error');
        }, 300);
        
    }if (roomDescriptionInput.value == ""){
        roomDescriptionInput.classList.add("error");
        setTimeout(function() {
            roomDescriptionInput.classList.remove('error');
        }, 300);
    } else{
        var currID = new Date().getTime().toString();
        postInfo("/addRoom", [currID, roomNameInput.value, roomDescriptionInput.value]);
        postInfo("/addUser", [userID, currID, "owner"]);
        
        Chatrooms[currID] = new chatRoom(roomNameInput.value, roomDescriptionInput.value, currID);
        
    }
})


//Send message on enter
const sendMessageButton = document.querySelector('button.send-message');
const messageBox = document.querySelector('textarea');
messageBox.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessageButton.click();
    }
});


//Send message
sendMessageButton.addEventListener('click', function(){
    const selectedRoom = document.querySelector('.selected');
    if (selectedRoom){
        Chatrooms[selectedRoom.id].sendMessage();
    } else{
        alert("Please select a room to message in first")
        sendMessageButton.previousElementSibling.value = "";
    }
})

