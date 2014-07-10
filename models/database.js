var mongoose = require('mongoose');

var uristring =
process.env.MONGOLAB_URI ||
'mongodb://localhost/';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
})
  , Schema = mongoose.Schema;

require('./summonerModel.js')
require('./requestModel.js')