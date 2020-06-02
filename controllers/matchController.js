function matchController(Match) {
    function post(req, res) {
        const match = new Match(req.body);
        if(!req.body.matchName || !req.body.matchDate || !req.body.matchScore || !req.body.matchRank) {
            return res.sendStatus(403);
        }

        match.save(function (err) {
            if(err) {
                res.send(err);
            } else {
                return res.status(201).json(match);
            }
        });
    }

    function get(req, res, err) {
        const query = {};
        if(req.query.matchName){
            query.matchName = req.query.matchName;
        } else if(req.query.matchDate) {
            query.matchDate = req.query.matchDate;
        } else if(req.query.matchScore) {
            query.matchScore = req.query.matchScore;
        } else if(req.query.matchRank) {
            query.matchRank = req.query.matchRank;
        }

        const hostUrl = `http://${req.headers.host}/api/archerymatch/`
        let perPage = parseInt(req.query.limit);
        let page = parseInt(req.query.start);

        console.log(perPage);

        if (req.query.start === '' || req.query.limit === '') {
            perPage = 10;
            page = 0;
        }
        Match.find({})
            .skip((page + 1) * perPage)
            .limit(perPage)
            .exec(function (err, match) {
                Match.countDocuments().exec(function (err, count) {
                    if(err) {
                        return res.send(err);
                    };
                    const items = [];
                    for(i = 0; i < match.length; i++) {
                        const item = match[i].toJSON();
                        item._links = {
                            self: {
                                href: `http://${req.headers.host}/api/archerymatch/${item._id}`
                            },
                            collection: {
                                href: `http://${req.headers.host}/api/archerymatch/`
                            }
                        }
                        items.push(item);
                    }
                    const collection = {
                        items: items,
                        _links: {
                            self: {
                                href: `http://${req.headers.host}/api/archerymatch/`
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

module.exports = matchController;