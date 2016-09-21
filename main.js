var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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


//SPIKE CODE 
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
//END SPIKE CODE
app.get('/character/:characterName', function (req, res) {
    var name = req.params.characterName;
    db.serialize(function () {
        db.get("SELECT character FROM character WHERE name = ?", [name], function (err, row) {
            var character = {};
            if (err) {
                console.log(err);
            }
            console.log(row);
            character = row;

            res.setHeader('Content-Type', 'application/json');
            console.log("-----------------");
            console.log(character);
            res.send(character);
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
            db.run("CREATE TABLE character (id INTEGER PRIMARY KEY AUTOINCREMENT, character TEXT, player INT, name TEXT)");
            db.run("CREATE TABLE adventure ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE player (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE story (id INTEGER PRIMARY KEY AUTOINCREMENT, story TEXT)");
            db.run("CREATE TABLE adventurePlayers (adventureId INT, playerId INT)");
            db.run("CREATE TABLE adventureStories (adventureId INT, storyId INT)");
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


//BEGIN SPIKE CODE

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/auth/google/return',
            passport.authenticate('google', {
                    successRedirect : 'http://localhost:8383/tabletoplite/index.html#/story',
                    failureRedirect : '/'
            }));
passport.use(new GoogleStrategy({
    callbackURL: 'http://localhost:3000/auth/google/return',
    clientID: '657704494395-0l7ie4lgo57b73sffj7ltdgq64fd7kkf.apps.googleusercontent.com',
    clientSecret: 'BIJG3Wqgdn03U9L8yu4KN3tC'
  },
  function(token, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      console.log(profile);
      return done(null, profile);
    });
  }
));
//END SPIKE CODE