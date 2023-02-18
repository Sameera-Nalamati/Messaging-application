const http = require("http");
const fs = require("fs");

const chatroomsData = {
    "1" : {
        "name" : "Tesla Tower",
        "description" : "Electricity for all",
        "messages":[
            ["Tesla", "I have this idea for a tower that can beam wireless electricity across every corner of earth.", "May 11", "3:20 pm"],
            ["J.P. Morgan", "Hmm, what's it going to cost.", "May 11", "3:20 pm"],
            ["Tesla", "A few hundred thousand dollars.", "May 11", "3:21 pm"]
        ],
        "users":[
            ["You(admin)", "owner"],
            ["J.P. Morgan", "admin"], 
            ["Thomas Edison", "manager"], 
            ["Guglielmo Marconi", "manager"]
        ]
    },
    "2" : {
        "name" : "Wardenclyffe Workshop",
        "description" : "Electicity for some people.",
        "messages" : [
            ["Tesla", "Hello!", "May 11", "3:20 pm"],
            ["J.P. Morgan", "Hi!!", "May 11", "3:20 pm"],
            ["Tesla", ":D", "May 11", "3:21 pm"]
        ],
        "users" : [
            ["J.P. Morgan", "admin"], 
            ["Nelson Mandela", "manager"]
        ]
    },
    "3" : {
        "name" : "AC > DC",
        "description" : "Electicity for no one.",
        "messages" : [
            ["Tesla", "Wardenclyffe Workshop", "May 11", "3:20 pm"],
            ["J.P. Morgan", "What?", "May 11", "3:20 pm"]
        ],
        "users" : [
            ["J.P. Morgan", "admin"], 
            ["Nelson Mandela", "manager"]
        ]
    }
}

const lookup = require("mime-types").lookup;
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        req.url = "index.html";
    } else if (req.url === "/chatroomsData"){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatroomsData));
    }

    let file = __dirname +"/" + req.url;

    fs.readFile(file, function(err, content) {
        if (err) {
            res.writeHead(404);
            res.end();
        } else {
            res.setHeader("X-Content-Type-Options", "nosniff");
            let mime = lookup(req.url);
            res.writeHead(200, { "Content-type": mime });
            res.end(content);
        }
    });
});

server.listen(1234, "localhost", () => {
    console.log("Listening on port 1234");
});

