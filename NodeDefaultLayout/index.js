const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "node.db";
const db = new sqlite3.Database(dbSource);
const bodyParser = require('body-parser');

const HTTP_PORT = 8000;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(cors());



app.listen(HTTP_PORT);