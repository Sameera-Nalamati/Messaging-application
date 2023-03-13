const mysql = require("mysql");


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "messaging_application"
})

module.exports.connectionDB = conn

const pool = mysql.createPool({
    connectionLimit: 10,    
    host: "localhost",
    user: "root",
    password: "root",
    database: "messaging_application"
 
}); 

const user = "tesla@gmail.com";
const chatroomsData = {};

queryPromise1 = () =>{
    let query = `SELECT room.room_id, room_name, room_description FROM room INNER JOIN participants ON room.room_id = participants.room_id WHERE participants.email_id = '${user}';`;
    return new Promise((resolve, reject)=>{
        pool.query(query,  (error, results)=>{
            if(error){
                return reject(error);
            }

            for (let room of results){
                chatroomsData[room.room_id] = {
                    "name" : room.room_name,
                    "description": room.room_description,
                    "messages" : [],
                    "users" : []
                }
            }

            var rooms = Object.keys(chatroomsData);
            return resolve(rooms);
        });
    });
};

queryPromise2 = (rooms) => {
    let query = `SELECT message.room_id, message.message_text, DATE_FORMAT(message.sent_datetime, '%b %d') AS date, DATE_FORMAT(message.sent_datetime, '%h:%i %p') AS time, user.username FROM message INNER JOIN user ON message.sender_id = user.email_id WHERE message.room_id IN (${rooms}) ORDER BY sent_datetime ;`;
    return new Promise((resolve, reject)=>{
        pool.query(query,  (error, results)=>{
            if(error){
                return reject(error);
            }

            for (let message of results){
                chatroomsData[message.room_id]["messages"].push([message.username, message.message_text, message.date, message.time]);
            }

            return resolve(results);
        });
    });
};

queryPromise3 = (rooms) =>{
    let query = `SELECT room_id, username, role  FROM participants INNER JOIN user ON participants.email_id = user.email_id WHERE role != 'owner' AND participants.room_id IN (${rooms}) ORDER BY role DESC ;`;
    return new Promise((resolve, reject)=>{
        pool.query(query,  (error, results)=>{
            if(error){
                return reject(error);
            }

            for (let participant of results){
                chatroomsData[participant.room_id]["users"].push([participant.username, participant.role]);
            }

            return resolve(results);
        });
    });
};

async function sequentialQueries () {
    try{
        const result1 = await queryPromise1();
        const result2 = await queryPromise2([result1]);
        const result3 = await queryPromise3(result1);
    } catch(error){
        console.log(error)
    }

    return chatroomsData;
}

// sequentialQueries();

module.exports.chatroomsData = sequentialQueries;
