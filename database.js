const e = require("express");
const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "messaging_application"
})

let user;
const chatroomsData = {};


roomPromise = () => {
    let query = `SELECT room.room_id, room_name, room_description FROM room INNER JOIN participants ON room.room_id = participants.room_id WHERE participants.email_id = '${user}';`;
    return new Promise((resolve, reject) => {
        conn.query(query,  (error, results) => {
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
            console.log("Running roomPromise");

            return resolve(chatroomsData);
        });
    });
};


dataPromise = (room) => {
    let query = `SELECT message.room_id, message.message_text, DATE_FORMAT(message.sent_datetime, '%b %d') AS date, DATE_FORMAT(message.sent_datetime, '%h:%i %p') AS time, user.username FROM message INNER JOIN user ON message.sender_id = user.email_id WHERE message.room_id = (${room}) ORDER BY sent_datetime ;`;
    return new Promise((resolve, reject)=>{
        conn.query(query,  (error, results)=>{
            if(error){
                roomPromise();
            }

            console.log(chatroomsData[room]);
            chatroomsData[room]["messages"] = [];
            for (let message of results){
                chatroomsData[message.room_id]["messages"].push([message.username, message.message_text, message.date, message.time]);
            }
            
            let query = `SELECT room_id, username, role  FROM participants INNER JOIN user ON participants.email_id = user.email_id WHERE role != 'owner' AND participants.room_id IN (${room}) ORDER BY role DESC ;`
            conn.query(query,  (error, results)=>{
                if(error){
                    return reject(error);
                }
    
                chatroomsData[room]["users"] = []
    
                for (let participant of results){
                    chatroomsData[participant.room_id]["users"].push([participant.username, participant.role]);
                }
        
                return resolve(chatroomsData[room]);
            });
        });
    });
};


function addUser(data, res){
    const [emailID, roomID, role] = data;
    let query = `SELECT email_id, username FROM user WHERE email_id = "${emailID}";`;

    conn.query(query, function(err, result){
        if (result.length == 0){
            return res.status(200).send({status: 'no user'});
        } else{
            query = `SELECT email_id FROM participants WHERE email_id = "${emailID}" AND room_id = ${roomID};`;
            conn.query(query, function(err, results){
                if (results.length == 0){
                    query = `INSERT INTO participants(email_id, room_id, role) VALUES ('${emailID}', ${roomID}, '${role}')`;
                    
                    conn.query(query, function(err, results){
                        if (role == "owner"){
                            roomPromise()
                            .then((x) => {
                                console.log(x);
                            })
                        };
                        
                        return res.status(200).send({status: 'user added', username: result[0]['username']});
                    }) 
                } else{
                    return res.status(200).send({status: 'user already exists'});
                }
            })
        }
    })

}


function postMessage(data, res){
    const [messageText, userID, roomID] = data;

    let query = `INSERT INTO message(message_text, sender_id, room_id) VALUES ('${messageText}', '${userID}', ${roomID})`;
    conn.query(query, function(err, results){
        if (err) return res.status(400).send({status: 'error'});
        return res.status(200).send({status: 'message posted'});
    })
}


function addRoom(data, res){
    const [id, roomName, roomDescription] = data;

    let query = `INSERT INTO room(room_id, room_name, room_description) VALUES (${id}, '${roomName}', '${roomDescription}')`;
    
    conn.query(query, function(err, results){
        if (err) return res.status(400).send({status: 'room not added'});
        
        return res.status(200).send({status: 'room added'});    
    })
}


function deleteRoom(data, res){
    const [id] = data;
    let query = `DELETE FROM room WHERE room_id = ${id}`;

    conn.query(query, function(err, results){
        if (err) return res.status(400).send({status: 'room not deleted'});
        delete chatroomsData[id];
        return res.status(200).send({status: 'room deleted'});   
    })
}


function loginCheck(data, res){
    const [email, password] = data;
    user = email;
    let query = `SELECT email_id FROM user WHERE email_id = "${email}"`;

    conn.query(query, function(err, results){
        console.log(results);
        if (results.length == 0){
            return res.status(200).send({status: 'no user'});   
        } else {
            query = `SELECT password FROM user WHERE email_id = "${email}"`;
            conn.query(query, function(err, results){
                if (results[0].password == password){
                    roomPromise();
                    return res.status(200).send({status: 'valid user'});   
                } else {
                    return res.status(200).send({status: 'invalid user'})
                }
            })
        }
        if (err) return res.status(400).send({status: 'error'});
    })
}


function registerUser(data, res){
    const [email, username, password] = data;

    let query = `SELECT * FROM user WHERE email_id = "${email}"`;
    console.log(query);

    conn.query(query, function(err, results){
        if (results.length != 0){
            return res.status(200).send({status: 'user already exists'});
        } else{
            query = `INSERT INTO user(email_id, username, password) VALUES ("${email}", "${username}", "${password}");`;
            console.log(query);
            conn.query(query, function(err, results){
                console.log(results);
                if (err) return res.status(200).send({status: 'error'});   
                return res.status(200).send({status: 'user added'});   
            })
        }
    })
}


module.exports.roomPromise = roomPromise;
module.exports.dataPromise = dataPromise;
module.exports.addUser = addUser;
module.exports.postMessage = postMessage;
module.exports.addRoom = addRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.loginCheck = loginCheck;
module.exports.registerUser = registerUser;
