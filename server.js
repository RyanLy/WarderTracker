var express = require('express');
var app  = express();
var server = require('http').createServer(app);
var path = require('path');
var fs = require('fs');
var getOutput = require('./js/wardInformationScrapper') //provides dict of names
var rateLimit = require('function-rate-limit');

/*
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Comment = new Schema({
    username : String,
    content  : String,
    created  : Date
});
 
mongoose.model( 'Comment', Comment );
*/

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./css'));
app.use(express.static('./js'));

app.set('view engine', 'html');

app.engine('.html', require('ejs').__express);

var names = ['Windask','Lightbrite','Khey','xBiscuits','Kottonbun','aePheva','DragonSlayer965']

var fns = rateLimit(1,20000,function(x){
	playerWardInformation = getOutput(x);
});

fns(names)


app.get('/', function(req, res) {
	var outputs = "<h1> Ward Counts </h1>"
	outputs += "--------------------------<br>"
	for (name in names){
		outputs += names[name] + ": " + playerWardInformation[names[name].toLowerCase()] + "<br>"
	}
    res.render('index', {
    output: outputs});
 });

app.get('/refresh', function(req, res) {
	fns(names);
 });

app.get('/title', function(req,res) {
	res.render('title_page');
});

app.listen(process.env.PORT || 7000)

console.log("Listening on port 7000");