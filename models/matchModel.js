const mongoose = require('mongoose');

const {Schema} = mongoose;

const matchModel =  new Schema({
        matchName: {type:String, default: null},
        matchDate: {type:String, default: null},
        matchScore: {type:String, default: null},
        matchRank: {type:String, default: null},
    }
);

module.exports = mongoose.model('archerymatch', matchModel);