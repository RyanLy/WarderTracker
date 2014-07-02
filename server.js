var express = require('express');
var app  = express();
var server = require('http').createServer(app);
var path = require('path');
var fs = require('fs');
var http = require('http');

var getOutput = require('./js/wardInformationScrapper') //provides dict of names
var rateLimit = require('function-rate-limit');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/';

var mongoose = require('mongoose');
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
})
  , Schema = mongoose.Schema;

var rateLimit = require('function-rate-limit');

var summonerSchema = new Schema({
    name:  String,
    lowercase: String,
    wards: Number,
    sightWardsBought: Number
});
var Summoner = mongoose.model('Summoners', summonerSchema)

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./css'));
app.use(express.static('./js'));
app.set('view engine', 'html');

app.engine('.html', require('ejs').__express);

var fns = rateLimit(1,20000,function(x){
	playerWardInformation = getOutput(x);
});

app.get('/summoners.json', function(req, res) {
  Summoner.find(function (err, summoner) {
		if (err) return console.error(err);
		res.send(summoner);
	})
});

app.get('/', function(req,res) {
	res.render('title_page');
});

app.get('/clearDB', function(req,res) {
	Summoner.find(function (err, summoner) {
	}).remove().exec();
	console.log("DBCleared");
	res.redirect('/');
});


app.post('/request', function(req, res) {
	summonerName = req.param('name');
	console.log(summonerName);
	getOutput(summonerName)(
		function (callback) {
		    res.send("Summoner: " + callback[0] + ", Wards: " + callback[1])
		},
		function (err){
			res.send(err)
		}
	);
});

app.listen(process.env.PORT || 7000)

console.log("Listening on port 7000");