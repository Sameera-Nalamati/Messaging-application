const express = require("express");
const app = express();

app.use(express.static(__dirname));

const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "messaging_application"
})

exports.conn = conn;
console.log(exports);

const chatroomsData = {}

let query = "SELECT room_id, room_name, room_description FROM room;";

conn.query(query, function(err, results){
    if (err) throw err;

    for (let room of results){
        chatroomsData[room.room_id] = {
            "name" : room.room_name,
            "description": room.room_description,
            "messages" : [],
            "users" : []
        }
    }
})


query = "SELECT message.room_id, message.message_text, DATE_FORMAT(message.sent_datetime, '%b %d') AS date, DATE_FORMAT(message.sent_datetime, '%h:%i %p') AS time, user.username FROM message INNER JOIN user ON message.sender_id = user.email_id ORDER BY sent_datetime;"

conn.query(query, function(err, results){
    if (err) throw err;

    for (let message of results){
        chatroomsData[message.room_id]["messages"].push([message.username, message.message_text, message.date, message.time]);
    }
})


query = "SELECT room_id, username, role  FROM participants INNER JOIN user ON participants.email_id = user.email_id;";

conn.query(query, function(err, results){
    if (err) throw err;

    for (let participant of results){
        chatroomsData[participant.room_id]["users"].push([participant.username, participant.role]);
    }
})


console.log(chatroomsData);

// const chatroomsData = {
//     "1" : {
//         "name" : "Tesla Tower",
//         "description" : "Electricity for all",
//         "messages":[
//             ["Tesla", "I have this idea for a tower that can beam wireless electricity across every corner of earth.", "May 11", "3:20 pm"],
//             ["J.P. Morgan", "Hmm, what's it going to cost.", "May 11", "3:20 pm"],
//             ["Tesla", "A few hundred thousand dollars.", "May 11", "3:21 pm"]
//         ],
//         "users":[
//             ["J.P. Morgan", "admin"], 
//             ["Thomas Edison", "manager"], 
//             ["Guglielmo Marconi", "manager"]
//         ]
//     },
//     "2" : {
//         "name" : "Wardenclyffe Workshop",
//         "description" : "Electicity for some people.",
//         "messages" : [
//             ["Tesla", "Hello!", "May 11", "3:20 pm"],
//             ["J.P. Morgan", "Hi!!", "May 11", "3:20 pm"],
//             ["Tesla", ":D", "May 11", "3:21 pm"]
//         ],
//         "users" : [
//             ["J.P. Morgan", "admin"], 
//             ["Nelson Mandela", "manager"]
//         ]
//     },
//     "3" : {
//         "name" : "AC > DC",
//         "description" : "Electicity for no one.",
//         "messages" : [
//             ["Tesla", "Wardenclyffe Workshop", "May 11", "3:20 pm"],
//             ["J.P. Morgan", "What?", "May 11", "3:20 pm"]
//         ],
//         "users" : [
//             ["J.P. Morgan", "admin"], 
//             ["Nelson Mandela", "manager"]
//         ]
//     }
// }

app.get('/', (req, res) => {
  res.header("Content-Type",'text/html');
  res.sendFile('index.html', { root: __dirname });
  console.log(data);
})

app.get('/chatroomsData', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(chatroomsData));
})

app.listen(3000, function() {
  console.log("Running on port 3000.");
});

// window.conn = conn;