var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var file = "character.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = '';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// respond with "hello world" when a GET request is made to the homepage
app.get('/character/:characterName', function (req, res) {
    var name = req.params.characterName;
    db.serialize(function () {
        db.get("SELECT * FROM character WHERE name = ?", [name], function (err, row) {
            var character = {};
            if (err) {
                console.log(err);
            }
            console.log(row);
            character = row;

            res.setHeader('Content-Type', 'application/json');
            console.log("-----------------");
            console.log(character);
            res.send(JSON.stringify(character));
        });
    });
});

app.post('/character', function (req, res) {
    var character = req.body;
    insertNewCharacter(character);
});

app.listen(3000, function () {
    setup();
    console.log("Listening on port 3000");
});

function setup() {
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
    }

    db = new sqlite3.Database(file);

    if (!exists) {
        db.serialize(function () {
            db.run("CREATE TABLE character (character TEXT, player TEXT, name TEXT)");
        });
    }
}

function insertNewCharacter(character) {
    db.serialize(function () {
        db.run("INSERT INTO character (character, name) VALUES (?, ?)", JSON.stringify(character), character.name);
    });
}

function getCharacterByName(name) {
    var character = {};
    db.serialize(function () {
        db.get("SELECT * FROM character WHERE name = ?", [name], function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log(row);
            character = row;
        });

    });

    return character;
}
process.on("exit", function () {
    db.close();
});