exports.setRoutes = function (app, dao) {
    app.get('/story/:storyId/:adventureId/:characterId/:turn', function (req, res) {
        var storyId = req.params.storyId;
        var characterId = req.params.characterId;
        var adventureId = req.params.adventureId;
        var turn = req.params.turn;
        console.log("turn: " + turn);
        if (turn === 'false') {
            console.log("------STORY WITH NO TURN-----------");
            dao.getStoryById(storyId, function (story) {
                res.setHeader('Content-Type', 'application/json');
                console.log(story);
                res.send(story);
            });
        } else {
            dao.updateGameTurnByCharacter(storyId, characterId, adventureId);
            dao.checkIfAllCharactersTookTurn(adventureId, storyId, function (allTurnsTaken) {
                console.log("All Turns Taken: " + allTurnsTaken);
                if (allTurnsTaken) {
                    dao.getStoryById(storyId, function (story) {
                        res.setHeader('Content-Type', 'application/json');
                        console.log("------STORY WITH TURN-----------");
                        console.log(story);
                        res.send(story);
                    });
                }
            });
        }
    });

    app.get('/character/:characterName', function (req, res) {
        var name = req.params.characterName;
        dao.getCharacterByName(name, function (character) {
            res.setHeader('Content-Type', 'application/json');
            console.log("-------CHARACTER----------");
            console.log(character);
            res.send(character);
        });
    });

    app.post('/character', function (req, res) {
        var character = req.body;
        dao.insertNewCharacter(character);
    });

    app.get('/storyHistory/:adventureId', function (req, res) {
        var adventureId = req.params.adventureId;
        dao.getStoryHistoryByAdventureId(adventureId, function (storyHistory) {
            res.setHeader('Content-Type', 'application/json');
            console.log("--------STORY HISTORY---------");
            console.log(storyHistory);
            res.send(storyHistory);
        });
    });
    
    app.post('/storyHistory/', function (req, res) {
        var storyHistory = req.body;

        if (storyHistory.id) {
            dao.updatetoryHistory(storyHistory.id, storyHistory.storyHistory);
        } else {
            dao.insertNew(storyHistory.adventureId, storyHistory.storyHistory);
        }
    });
    
    app.post('/adventure/', function(req, res){
       var adventure = req.body;
       
       dao.insertNewAdventure(adventure.name, adventure.description, function(id){
           console.log("Adventure ID: " + id);
           res.status(200).send({id: id});
       });
    });
};

