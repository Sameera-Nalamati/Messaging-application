const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
// const http = require("http");
// const socket = require("socket.io");

const database = require('./database.js');
// const onSocket = require("./socket.js");


const app = express();
// const httpServer = http.createServer(app);
// const io = new socket.Server(httpServer);
// onSocket.onSocket(io);

app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const conn = database.connectionDB;

app.get('/', (req, res) => {
    res.header("Content-Type",'text/html');
    res.sendFile('index.html', { root: __dirname });
})

app.get('/chatroomsData', (req, res) => {
    database.chatroomsData()
    .then((chatroomsData) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatroomsData));
    });

    // console.log(chatroomsData);

    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(chatroomsData));
})

app.post('/addUser', (req, res) => {
    const [emailID, roomID, role] = req.body.data;

    let query = `SELECT email_id, username FROM user WHERE email_id = "${emailID}";`;

    conn.query(query, function(err, result){
        if (result.length == 0){
            return res.status(400).send({status: 'no user'});
        } else{
            query = `SELECT email_id FROM participants WHERE email_id = "${emailID}" AND room_id = ${roomID};`;
            conn.query(query, function(err, results){
                if (results.length == 0){
                    query = `INSERT INTO participants(email_id, room_id, role) VALUES ('${emailID}', ${roomID}, '${role}')`;
                    conn.query(query, function(err, results){
                        console.log(results);
                        console.log(err);
                        return res.status(200).send({status: 'user added', username: result[0]['username']});
                    }) 
                } else{
                    return res.status(400).send({status: 'user already exists'});
                }
            })
        }
    })
})

app.post('/postMessage', (req, res) => {
    const [messageText, userID, roomID] = req.body.data;

    let query = `INSERT INTO message(message_text, sender_id, room_id) VALUES ('${messageText}', '${userID}', ${roomID})`;
    conn.query(query, function(err, results){
        console.log(results);
    })
})

app.post('/addRoom', (req, res) => {
    const [id, roomName, roomDescription] = req.body.data;

    let query = `INSERT INTO room(room_id, room_name, room_description) VALUES (${id}, '${roomName}', '${roomDescription}')`;

    conn.query(query, function(err, results){
        console.log(err, results);
    })

    console.log(id, roomName, roomDescription);
})

app.post('/deleteRoom', (req, res) => {
    const [id] = req.body.data;
    let query = `DELETE FROM room WHERE room_id = ${id}`;

    conn.query(query, function(err, results){
        console.log(err, results);
    })

    // fetch('/chatroomsData');
})


app.listen(3000, function() {
    console.log("Running on port 3000.");
});



// httpServer.listen(3000, () => {
//     console.log("listening on port 3000");
// })
