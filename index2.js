let Chatrooms = {};

//Temporary data
let currID = 'room' + new Date().getTime().toString();
Chatrooms[currID + 1] = new chatRoom("Tesla Tower", "Electicity for all.", currID+1);
Chatrooms[currID + 1].messages.push(
    ["Tesla", "I have this idea for a tower that can beam wireless electricity across every corner of earth.", "May 11", "3:20 pm"],
    ["J.P. Morgan", "Hmm, what's it going to cost.", "May 11", "3:20 pm"],
    ["Tesla", "A few hundred thousand dollars.", "May 11", "3:21 pm"]
);
Chatrooms[currID + 1].users.push(
    ["You(admin)", "owner"],
    ["J.P. Morgan", "admin"], 
    ["Thomas Edison", "manager"], 
    ["Guglielmo Marconi", "manager"]
);

Chatrooms[currID + 2] = new chatRoom("Wardenclyffe Workshop", "Electicity for some people.", currID+2);
Chatrooms[currID + 2].users.push(
    ["J.P. Morgan", "admin"], 
    ["Nelson Mandela", "manager"]
);
Chatrooms[currID + 2].messages.push(
    ["Tesla", "Wardenclyffe Workshop", "May 11", "3:20 pm"],
    ["J.P. Morgan", "What?", "May 11", "3:20 pm"]
);

Chatrooms[currID + 3] = new chatRoom("AC > DC", "Electicity for no one bleh!!.", currID+3);
Chatrooms[currID + 3].users.push(
    ["J.P. Morgan", "admin"], 
    ["Nelson Mandela", "manager"]
);
Chatrooms[currID + 3].messages.push(
    ["Tesla", "Hello!", "May 11", "3:20 pm"],
    ["J.P. Morgan", "Hi!!", "May 11", "3:20 pm"],
    ["Tesla", ":D", "May 11", "3:21 pm"]
);


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

