var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var dao = require('./DataAccess/Dao');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//SPIKE CODE 
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
//END SPIKE CODE

app.get('/story/:storyId', function (req, res) {

});

app.get('/character/:characterName', function (req, res) {
    var name = req.params.characterName;
    var character = dao.getCharacterByName(name, function (character) {
        res.setHeader('Content-Type', 'application/json');
        console.log("-----------------");
        console.log(character);
        res.send(character);
    });
});

app.post('/character', function (req, res) {
    var character = req.body;
    dao.insertNewCharacter(character);
});

app.listen(3000, function () {
    setup();
    console.log("Listening on port 3000");
});

function setup() {
    dao.setupDB();
}

process.on("exit", function () {
    dao.cleanupDB();
});

//BEGIN SPIKE CODE

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/return',
        passport.authenticate('google', {
            successRedirect: 'http://localhost:8383/tabletoplite/index.html#/story',
            failureRedirect: '/'
        }));
passport.use(new GoogleStrategy({
    callbackURL: 'http://localhost:3000/auth/google/return',
    clientID: '657704494395-0l7ie4lgo57b73sffj7ltdgq64fd7kkf.apps.googleusercontent.com',
    clientSecret: 'BIJG3Wqgdn03U9L8yu4KN3tC'
},
        function (token, refreshToken, profile, done) {
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