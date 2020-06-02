const express = require('express');
const matchController = require('../controllers/matchController')

function routes(Match){
    const matchRouter = express.Router();
    const controller = matchController(Match);

    // Middleware
    matchRouter.use('/archerymatch/:matchId', (req, res, next) => {
        Match.findById(req.params.matchId, (err, match) => {
            if(err){
                return res.send(err);
            }
            if(match){
                req.match = match;
                host = req.header.host
                return next();
            } else {
                return res.sendStatus(404);}
        });
    });

    matchRouter.route('/archerymatch/:matchId')
        .get((req, res) => {
            const returnMatch = req.match.toJSON();
            console.log(returnMatch);
            returnMatch._links = {};
            returnMatch._links.self = {};
            returnMatch._links.self.href = `http://${req.headers.host}/api/archerymatch/${returnMatch._id}`;
            returnMatch._links.collection = {};
            returnMatch._links.collection.href = `http://${req.headers.host}/api/archerymatch/`;
            return res.json(returnMatch);
        })
        .put((req, res) => {
            const { match } = req;
            match.matchName = req.body.matchName;
            match.matchDate = req.body.matchDate;
            match.matchScore = req.body.matchScore;
            match.matchRank = req.body.matchRank;
            if(!match.matchName || !match.matchDate || !match.matchScore || !match.matchRank) {
                return res.sendStatus(403);
            }

            else {
                req.match.save((err) => {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(match);
                });
            }
        })
        .patch((req, res) => {
            const { match } = req;

            if(req.body._id) {
                delete req.body._id;
            }
            Object.entries(req.body).forEach(item => {
                const key = item[0];
                const value = item[1];
                match[key] = value;
            })
            req.match.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(match);
            });
        })
        .delete((req, res) => {
            req.match.remove((err) => {
                if(err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            });
        })
        .options((req, res, next) => {
            if (!res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Content-Type, Application/json, Content-Type, Application/x-www-form-urlencoded')) {
                res.sendStatus(416);
            }

            else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader("Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
                res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Content-Type', 'Application/json,  Application/x-www-form-urlencoded');
                res.setHeader('Access-Control-Allow-Accept', 'Application/json,  x-www-form-urlencoded');
                return res.sendStatus(200);
            }
        });

    // All archery matches
    matchRouter.route('/archerymatch/:start?/:limit?')
        .post(controller.post)
        .get(controller.get)
        .options(controller.options);

    return matchRouter;
}

module.exports = routes;