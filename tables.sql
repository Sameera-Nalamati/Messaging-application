CREATE TABLE user(
    email_id VARCHAR(50) PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_time TIMESTAMP DEFAULT NOW()
);


CREATE TABLE room(
    room_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    room_name VARCHAR(50) NOT NULL,
    room_description VARCHAR(50) NOT NULL,
    created_time TIMESTAMP DEFAULT NOW()
);


CREATE TABLE participants(
    email_id VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    role VARCHAR(25) NOT NULL CHECK(role IN ('owner', 'admin', 'manager')),
    joined_time TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(email_id, room_id),
    FOREIGN KEY(email_id) REFERENCES user(email_id),
    FOREIGN KEY(room_id) REFERENCES room(room_id)
);


CREATE TABLE message(
    message_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    message_text VARCHAR(255) NOT NULL,
    sent_datetime TIMESTAMP NOT  NULL DEFAULT NOW(),
    sender_id VARCHAR(50) NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY(sender_id) REFERENCES user(email_id),
    FOREIGN KEY(room_id) REFERENCES room(room_id)
);


INSERT INTO user(email_id, username, password) VALUES
("tesla@gmail.com", "Tesla", "tesla"),
("thomas@gmail.com", "Thomas Edison", "123"),
("JP@gmail.com", "J.P. Morgan", "123"),
("gm@gmail.com", "Guglielmo Marconi", "123"),
("nelson@gmail.com", "Nelson Mandela", "123");

INSERT INTO room(room_name, room_description) VALUES
("Tesla Tower", "Electricity for all"),
("Wardenclyffe Workshop", "Electicity for some people."),
("AC > DC", "Electicity for no one.");

INSERT INTO participants(email_id, room_id, role) VALUES
("tesla@gmail.com", 1, "owner"),
("JP@gmail.com", 1, "admin"),
("thomas@gmail.com", 1, "admin"),
("gm@gmail.com", 1, "manager"),
("tesla@gmail.com", 2, "owner"),
("JP@gmail.com", 2, "admin"),
("nelson@gmail.com", 2, "manager"),
("tesla@gmail.com", 3, "owner"),
("JP@gmail.com", 3, "admin"),
("nelson@gmail.com", 3, "manager");

INSERT INTO message(message_text, sender_id, room_id) VALUES
("I have this idea for a tower that can beam wireless electricity across every corner of earth.", "tesla@gmail.com", 1),
("Hmm, what's it going to cost.", "JP@gmail.com", 1),
("A few hundred thousand dollars.", "tesla@gmail.com", 1),
("Hello!!", "tesla@gmail.com", 2),
("HI!!", "JP@gmail.com", 2),
(":D", "tesla@gmail.com", 2),
("Wardenclyffe Workshop", "tesla@gmail.com", 3),
("What?", "JP@gmail.com", 3);


SELECT room_id, room_name, room_description FROM room;

SELECT message.room_id, message.message_text, message.sent_datetime, user.username 
FROM message INNER JOIN user
ON message.sender_id = user.email_id;


SELECT 
    message.room_id, 
    message.message_text, 
    DATE_FORMAT(message.sent_datetime, '%b %d') AS date, 
    DATE_FORMAT(message.sent_datetime, '%h:%i %p') AS time, 
    user.username  
FROM message INNER JOIN user 
ON message.sender_id = user.email_id;


SELECT room_id, username, role 
FROM participants INNER JOIN user
ON participants.email_id = user.email_id;