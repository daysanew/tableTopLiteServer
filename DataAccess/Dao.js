var fs = require("fs");
var file = "character.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = '';

getGameTurnByStoryAndAdventureId = function (storyId, adventureId, callback) {
    db.serialize(function () {
        db.all("SELECT id, characterId, tookTurn FROM gameTurn WHERE storyId = ? AND adventureId = ?", [storyId, adventureId], function (err, rows) {
            if (err) {
                console.log(err);
            }

            callback(rows);
        });
    });
};

exports.insertNewCharacter = function (character) {
    db.serialize(function () {
        db.run("INSERT INTO character (character, name) VALUES (?, ?)", JSON.stringify(character), character.name);
    });
};

exports.getCharacterByName = function (name, callback) {
    db.serialize(function () {
        db.get("SELECT id, character FROM character WHERE name = ?", [name], function (err, row) {
            var character = {};
            if (err) {
                console.log(err);
            }
            character = row;

            callback(character);
        });
    });
};

exports.getStoryById = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT story FROM story WHERE id = ?", [id], function (err, row) {
            if (err) {
                console.log(err);
            }

            callback(row);
        });
    });
};

exports.getStoryHistoryByAdventureId = function (id, callback) {
    db.serialize(function () {
        db.get("SELECT id, adventureID, storyHistory FROM storyHistory WHERE adventureID = ?", [id], function (err, row) {
            if (err) {
                console.log(err);
            }

            callback(row);
        });
    });
};

exports.insertNewStoryHistory = function (adventureID, storyHitory) {
    db.serialize(function () {
        db.run("INSERT INTO storyHistory (adventureID, storyHistory) VALUES (?, ?)", adventureID, storyHitory);
    });
};

exports.updatetoryHistory = function (adventureID, storyHitory) {
    db.serialize(function () {
        db.run("UPDATE storyHistory SET storyHistory = ? WHERE adventureID = ? ", storyHitory, adventureID);
    });
};

exports.getGameTurnByStoryAndAdventureId = getGameTurnByStoryAndAdventureId;

exports.checkIfAllCharactersTookTurn = function (adventureId, storyId, callback) {
    getGameTurnByStoryAndAdventureId(storyId, adventureId, function (results) {
        var allTurnsTaken = true;
        console.log(results);
        results.forEach(function (item) {
            if (!item.tookTurn) {
                allTurnsTaken = false;
                return;
            }
        });

        callback(allTurnsTaken);
    });
};

exports.updateGameTurnByCharacter = function (storyId, characterId, adventureID) {
    db.serialize(function () {
        db.run("UPDATE gameTurn SET tookTurn = 1 WHERE storyId = ? AND characterId = ? AND adventureId = ?", storyId, characterId, adventureID);
    });
};

exports.insertNewAdventure = function (adventureName, adventureDescription, callback) {
    db.serialize(function () {
        console.log("Adventure name: " + adventureName + " Description: " + adventureDescription);
        db.run("INSERT INTO adventure (name, description) VALUES (?, ?)", [adventureName, adventureDescription], function () {
            console.log(this);
            callback(this.lastID);
        });
    });
};

exports.updateAdventure = function (adventureName, adventureDescription, adventureId) {
    db.serialize(function () {
        console.log("Adventure name: " + adventureName + " Description: " + adventureDescription);
        db.run("UPDATE adventure SET name = ?, description = ? WHERE id = ?", [adventureName, adventureDescription, adventureId]);
    });
};

exports.getAdventureById = function (adventureId, callback) {
    db.serialize(function () {
        db.run("SELECT * FROM adventure JOIN adventureStories ON adventure.id = adventureStories.adventureId " +
                "JOIN story ON story.id = adventureStories.storyId " +
                "WHERE adventure.Id = ?", [adventureId], function (err, row) {
            callback(row);
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
            db.run("CREATE TABLE adventure (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)");
            db.run("CREATE TABLE player (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE story (id INTEGER PRIMARY KEY AUTOINCREMENT, story TEXT)");
            db.run("CREATE TABLE adventurePlayers (adventureId INT, playerId INT)");
            db.run("CREATE TABLE adventureStories (adventureId INT, storyId INT)");
            db.run("CREATE TABLE storyHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, adventureID INTEGER UNIQUE, storyHistory TEXT)");
            db.run("CREATE TABLE GameTurn (id INTEGER PRIMARY KEY AUTOINCREMENT, characterId INTEGER NOT NULL, storyId INTEGER NOT NULL, tookTurn INTEGER, adventureId INTEGER NOT NULL)");
        });
    }
};

exports.cleanupDB = function () {
    db.close();
};
