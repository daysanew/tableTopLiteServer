exports.setRoutes = function (app, dao) {
    app.get('/story/:storyId', function (req, res) {
        var id = req.params.storyId;
        dao.getStoryById(id, function (story) {
            res.setHeader('Content-Type', 'application/json');
            console.log("------STORY-----------");
            console.log(story);
            res.send(story);
        });
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

    app.get('/storyHistory', function (req, res) {
        var adventureId = req.params.adventureId;
        dao.getStoryHistoryByAdventureId(adventureId, function (storyHistory) {
            res.setHeader('Content-Type', 'application/json');
            console.log("--------STORY HISTORY---------");
            console.log(storyHistory);
            res.send(storyHistory);
        });
    });
};

