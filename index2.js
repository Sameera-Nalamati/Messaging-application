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


setInterval(() => {
    let selectedRoom = document.querySelector('.selected'); 

    fetchData(Chatrooms)
    .then(() => {
        if (selectedRoom){
            console.log(selectedRoom);
            Chatrooms[selectedRoom.id].selectRoom(selectedRoom.firstChild);
            console.log(Chatrooms[selectedRoom.id]);
        }
    })
    
    console.log(Chatrooms);
}, 60000)


function showError(input){
    input.classList.add("error");

    setTimeout(function() {
        input.classList.remove('error');
    }, 300);
}

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
        showError(roomNameInput);

        
    }if (roomDescriptionInput.value == ""){
        showError(roomDescriptionInput);

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


const login_email = document.querySelector('input[type=text]#login_email');
const login_password = document.querySelector('input[type=password]#login_password');
const login_button = document.querySelector('button#login-user');

const register_email = document.querySelector('input[type=email]#register_email');
const register_username = document.querySelector('input[type=text]#register_username');
const register_password = document.querySelector('input[type=password]#register_password');
const register_button = document.querySelector('button#signup-user');

const login_popup = document.querySelector('.login-popup');
// console.log(login_popup);

//Login button click
const login = document.querySelector('input[type=button]#login');
login.addEventListener('click', function(){
    login_email.style.display = "inline";
    login_password.style.display = "inline";
    login_button.style.display = "inline";

    register_email.style.display = "none";
    register_username.style.display = "none";
    register_password.style.display = "none";
    register_button.style.display = "none";
})


//Signup button click
const signup = document.querySelector('input[type=button]#signup');
signup.addEventListener('click', function(){
    login_email.style.display = "none";
    login_password.style.display = "none";
    login_button.style.display = "none";

    register_email.style.display = "inline";
    register_username.style.display = "inline";
    register_password.style.display = "inline";    
    register_button.style.display = "inline";
})


login_button.addEventListener('click', function(e){
    e.preventDefault();

    let email = login_email.value;
    let password = login_password.value;

    if (email == ""){
        showError(login_email);

    } else if (password == ""){
        showError(login_password);

    } else {    
        postInfo("/userLogin", [email, password])
        .then((response) => {
            console.log(response);
            if (response.status == "no user"){
                showError(login_email);
                // alert("There is no user with this email ID");
            } else if (response.status == "valid user"){
                login_popup.style.display = "none";
                mask.style.display = "none";
                fetchData();
            } else if (response.status == "invalid user"){
                showError(login_password);

            } else {
                alert("Error!");
            }
        })
    }
})


register_button.addEventListener('click', function(e){
    e.preventDefault();

    let email = register_email.value;
    let username = register_username.value;
    let password = register_password.value;

    if (email == ""){
        showError(register_email);

    } else if (username == ""){
        showError(register_username);

    } else if (password == ""){
        showError(register_password);

    } else {    
        postInfo("/userRegister", [email, username, password])
        .then((response) => {
            console.log(response);
            if (response.status == "user already exists"){
                alert("There is already a user with this email ID");
            } else if (response.status == "user added"){
                window.location.reload();
            } else {
                alert("Error!");
            }
        })
    }
})