const express = require('express');
const problemController = require('../controllers/problemController')

function routes(Problem){
    const problemRouter = express.Router();
    const controller = problemController(Problem);

    // Middleware
    problemRouter.use('/parsonsproblems/:problemId', (req, res, next) => {
        Problem.findById(req.params.problemId, (err, problem) => {
            if(err){
                return res.send(err);
            }
            if(problem){
                req.problem = problem;
                host = req.header.host
                return next();
            } else {
                return res.sendStatus(404);}
        });
    });

    problemRouter.route('/parsonsproblems/:problemId')
        .get((req, res) => {
            const returnProbem = req.problem.toJSON();
            console.log(returnProbem);
            returnProbem._links = {};
            returnProbem._links.self = {};
            returnProbem._links.self.href = `http://${req.headers.host}/api/parsonsproblems/${returnProbem._id}`;
            returnProbem._links.collection = {};
            returnProbem._links.collection.href = `http://${req.headers.host}/api/parsonsproblems/`;
            return res.json(returnProbem);
        })
        .put((req, res) => {
            const { problem } = req;
            problem.problemName = req.body.problemName;
            problem.problemSubject = req.body.problemSubject;
            problem.problemPieces = req.body.problemPieces;
            problem.problemHints = req.body.problemHints;

            if(!problem.problemName || !problem.problemSubject || !problem.problemPieces || !problem.problemHints) {
                return res.sendStatus(403);
            }

            else {
                req.problem.save((err) => {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(problem);
                });
            }
        })
        .patch((req, res) => {
            const { problem } = req;

            if(req.body._id) {
                delete req.body._id;
            }
            Object.entries(req.body).forEach(item => {
                const key = item[0];
                const value = item[1];
                problem[key] = value;
            })
            req.problem.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(problem);
            });
        })

        .delete((req, res) => {
            req.problem.remove((err) => {
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

    // All parsons problems
    problemRouter.route('/parsonsproblems/:start?/:limit?')
        .post(controller.post)
        .get(controller.get)
        .options(controller.options);

    return problemRouter;
}

module.exports = routes;