let Chatrooms = {};
var currID = 'room' + new Date().getTime().toString();

fetch('/chatroomsData')
    .then(response => response.json())
    .then(chatroomsData => {
        let n = 1
        console.log(Object.keys(chatroomsData))
        for (room of Object.keys(chatroomsData)){
            let currRoom = chatroomsData[room]
            Chatrooms[currID + n] = new chatRoom(currRoom["name"], currRoom["description"], currID+n);
            Chatrooms[currID + n].messages.push(...currRoom["messages"]);
            Chatrooms[currID + n].users.push(...currRoom["users"]);
            n++;
        };
    })
    .catch(error => {
        console.error(error);
    });

//Add a new user
const addUser = document.querySelector("#add-user");
addUser.addEventListener("click", function(e){
    e.preventDefault();
    console.log("yeys");
    const selectedRoom = document.querySelector('.selected');
    console.log(selectedRoom);
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
        eval ("var " + roomNameInput.value + " = new chatRoom(roomNameInput.value, roomDescriptionInput.value);")
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

