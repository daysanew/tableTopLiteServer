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
        db.get("SELECT character FROM character WHERE name = ?", [name], function (err, row) {
            var character = {};
            if (err) {
                console.log(err);
            }
            character = row;

            callback(character);
        });
    });
};

exports.getStoryById = function(id, callback){
    db.serialize(function () {
        db.get("SELECT story FROM story WHERE id = ?", [id], function (err, row) {
            var story = {};
            if (err) {
                console.log(err);
            }

            callback(row);
        });
    });
};

exports.getStoryHistoryByAdventureId = function(id, callback){
        db.serialize(function () {
        db.get("SELECT id, storyHistory FROM storyHistory WHERE adventureID = ?", [id], function (err, row) {
            var storyHistory = '';
            if (err) {
                console.log(err);
            }
            
            callback(row);
        });
    });
};

exports.insertNewStoryHistory = function (adventureID, storyHitory) {
    db.serialize(function () {
        db.run("INSERT INTO storyHistory (adventureID, storyHitory) VALUES (?, ?)", adventureID, storyHitory);
    });
};

exports.updatetoryHistory = function (adventureID, storyHitory) {
    db.serialize(function () {
        db.run("UPDATE storyHistory SET storyHitory = ? WHERE adventureID = ? ", storyHitory, adventureID);
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
            db.run("CREATE TABLE `storyHistory` ( id INTEGER PRIMARY KEY AUTOINCREMENT, adventureID INTEGER UNIQUE, storyHistory TEXT )");
        });
    }
};

exports.cleanupDB = function () {
    db.close();
};
