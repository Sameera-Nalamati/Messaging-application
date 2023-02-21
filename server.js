const express = require("express");
const app = express();

app.use(express.static(__dirname));

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

