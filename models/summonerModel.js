var mongoose = require('mongoose');
Schema = mongoose.Schema;
var summonerSchema = new Schema({
    name:  String,
    ID: String,
    lowercase: String,
    wards: Number,
    sightWardsBought: Number,
    show: Boolean
});

Summoner = module.exports = mongoose.model('Summoners', summonerSchema)