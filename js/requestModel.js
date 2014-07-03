var mongoose = require('mongoose');
Schema = mongoose.Schema;
var requestSchema = new Schema({
    IP:  String,
    name: String,
    time: String
});

queryRequest = module.exports = mongoose.model('queryRequests', requestSchema)