var fs = require("fs");
var file = "character.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = '';

exports.insertNewCharacter = function (character) {
    db.serialize(function () {
        db.run("INSERT INTO character (character, name) VALUES (?, ?)", JSON.stringify(character), character.name);
    });
};

exports.getCharacterByName = function (name, callback) {
    db.serialize(function () {
        console.log("Name: " + name);
        db.get("SELECT character FROM character WHERE name = ?", [name], function (err, row) {
            var character = {};
            if (err) {
                console.log(err);
            }
            character = row;
            console.log("Character before callback: ~~~~~~~~~~~~~~");
            console.log(character);
            callback(character);
        });
    });
};

exports.setupDB = function () {
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
    }

    db = new sqlite3.Database(file);

    if (!exists) {
        db.serialize(function () {
            db.run("CREATE TABLE character (id INTEGER PRIMARY KEY AUTOINCREMENT, character TEXT, player INT, name TEXT)");
            db.run("CREATE TABLE adventure ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE player (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE story (id INTEGER PRIMARY KEY AUTOINCREMENT, story TEXT)");
            db.run("CREATE TABLE adventurePlayers (adventureId INT, playerId INT)");
            db.run("CREATE TABLE adventureStories (adventureId INT, storyId INT)");
        });
    }
};

exports.cleanupDB = function () {
    db.close();
};
