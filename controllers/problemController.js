function problemController(Problem) {
    function post(req, res) {
        const problem = new Problem(req.body);
        if(!req.body.problemName || !req.body.problemSubject || !req.body.problemPieces || !req.body.problemHints) {
            return res.sendStatus(403);
        }

        problem.save(function (err) {
            if(err) {
                res.send(err);
            } else {
                return res.status(201).json(problem);
            }
        });
    }

    function get(req, res, err) {
        const query = {};
        if(req.query.problemName){
            query.problemName = req.query.problemName;
        } else if(req.query.problemSubject) {
            query.problemSubject = req.query.problemSubject;
        } else if(req.query.problemPieces) {
            query.problemPieces = req.query.problemPieces;
        } else if(req.query.problemHints) {
            query.problemHints = req.query.problemHints;
        }

        const hostUrl = `http://${req.headers.host}/api/parsonsproblems/`
        let perPage = parseInt(req.query.limit);
        let page = parseInt(req.query.start);

        console.log(perPage);

        if (req.query.start === '' || req.query.limit === '') {
            perPage = 10;
            page = 0;
        }
        Problem.find({})
            .skip((page + 1) * perPage)
            .limit(perPage)
            .exec(function (err, problem) {
                Problem.countDocuments().exec(function (err, count) {
                    if(err) {
                        return res.send(err);
                    };
                    const items = [];
                    for(i = 0; i < problem.length; i++) {
                        const item = problem[i].toJSON();
                        item._links = {
                            self: {
                                href: `http://${req.headers.host}/api/parsonsproblems/${item._id}`
                            },
                            collection: {
                                href: `http://${req.headers.host}/api/parsonsproblems/`
                            }
                        }
                        items.push(item);
                    }
                    const collection = {
                        items: items,
                        _links: {
                            self: {
                                href: `http://${req.headers.host}/api/parsonsproblems/`
                            }
                        },
                        pagination: {
                            currentPage: Number(page),
                            currentItems: items.length,
                            totalPages: Math.ceil(Number(count)/perPage),
                            totalItems: Number(count),
                            _links: {
                                first: {
                                    page: 1,
                                    href: `${hostUrl}?start=1&limit=${perPage}`
                                },
                                last: {
                                    page: Math.ceil(count/perPage),
                                    href: `${hostUrl}?start=${Math.ceil(count/perPage)}&limit=${perPage}`
                                },
                                previous: {
                                    page: Number(page) - 1 || 1,
                                    href: `${hostUrl}?start=${Number(page)-1 || 1}&limit=${perPage}`
                                },
                                next: {
                                    page: Number(page) + 1 || Math.ceil(count/perPage),
                                    href: `${hostUrl}?start=${Number(page)+1}&limit=${perPage}`
                                }
                            }
                        }
                    };
                    if(err){
                        return res.send(err);
                    } else{
                        return res.json(collection);
                    }
                })
            });
    }

    function options(req, res, next) {
        if (!res.header('Access-Control-Allow-Headers', 'Content-Type, Accept , Content-Type, Application/json, Content-Type, Application/x-www-form-urlencoded')) {
            return res.sendStatus(416);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Allow', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Content-Type', 'Application/json,  Application/x-www-form-urlencoded');
            res.setHeader('Access-Control-Allow-Accept', 'Application/json,  x-www-form-urlencoded');
            return res.sendStatus(200);
        }
    }

    return {post, get, options};
}

module.exports = problemController;