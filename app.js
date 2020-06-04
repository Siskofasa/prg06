const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/parsonsProblemsAPI');
const port = process.env.PORT || 3000;
const Problem = require('./models/problemModel');
const problemRouter = require('./routes/problemRouter')(Problem);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
    } else {
        res.status(406).send({
            error: "We only accept application/json & application/x-www-form-urlencoded."
        })
    }
});

app.use('/api', problemRouter);

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.listen(port, () => {
    console.log('Running on port: ' + port);
});