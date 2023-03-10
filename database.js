// import mysql from "mysql";
const mysql = require("mysql");


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "messaging_application"
})

module.exports.connectionDB = conn


const chatroomsData = {};
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


query = "SELECT message.room_id, message.message_text, DATE_FORMAT(message.sent_datetime, '%b %d') AS date, DATE_FORMAT(message.sent_datetime, '%h:%i %p') AS time, user.username FROM message INNER JOIN user ON message.sender_id = user.email_id ORDER BY sent_datetime;";
conn.query(query, function(err, results){
    if (err) throw err;

    for (let message of results){
        chatroomsData[message.room_id]["messages"].push([message.username, message.message_text, message.date, message.time]);
    }
})


query = "SELECT room_id, username, role  FROM participants INNER JOIN user ON participants.email_id = user.email_id WHERE role != 'owner' ORDER BY role DESC ;";
conn.query(query, function(err, results){
    if (err) throw err;

    for (let participant of results){
        chatroomsData[participant.room_id]["users"].push([participant.username, participant.role]);
    }
})

module.exports.chatroomsData = chatroomsData

