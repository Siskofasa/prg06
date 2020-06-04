const mongoose = require('mongoose');

const {Schema} = mongoose;

const problemModel =  new Schema({
      /*  matchName: {type:String, default: null},
        matchDate: {type:String, default: null},
        matchScore: {type:String, default: null},
        matchRank: {type:String, default: null},

       */

        problemName: {type:String, default:null},
        problemSubject: {type:String, default:null},
        problemPieces: [{rule: String, ident: Number, distractor:Boolean}],
        problemHints: [{hintName: String, hintValid: Boolean}],
    }
);

module.exports = mongoose.model('parsonsproblems', problemModel);