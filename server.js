const express = require("express");
const bodyParser = require("body-parser");
const database = require('./database.js');

const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.header("Content-Type",'text/html');
    res.sendFile('index.html', { root: __dirname });
})


app.get('/chatroomsData', (req, res) => {
    database.roomPromise()
    .then((chatroomsData) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatroomsData));
    })
    .catch(() => {
        return res.status(400).send({status: 'database connection error'});
    })
})


app.post('/getData', (req, res) => {
    const [roomID] = req.body.data;
    database.dataPromise(roomID)
    .then((chatroomsData) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatroomsData));
    })
    .catch(() => {
        return res.status(400).send({status: 'database connection error'});
    })
})


app.post('/addUser', (req, res) => {
    database.addUser(req.body.data, res);
})


app.post('/postMessage', (req, res) => {
    database.postMessage(req.body.data, res);
})


app.post('/addRoom', (req, res) => {
    database.addRoom(req.body.data, res)
})


app.post('/deleteRoom', (req, res) => {
    database.deleteRoom(req.body.data, res);
})


app.post('/userLogin', (req, res) => {
    database.loginCheck(req.body.data, res)
})

app.post('/userRegister', (req, res) => {
    database.registerUser(req.body.data, res);
})


app.listen(3000, function() {
    console.log("Running on port 3000.");
});
