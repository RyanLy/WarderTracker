var express = require('express');
var app  = express();
var server = require('http').createServer(app);
var path = require('path');
var fs = require('fs');
var getOutput = require('./js/wardInformationScrapper') //provides dict of names

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./css'));
app.use(express.static('./js'));

app.set('view engine', 'html');

app.engine('.html', require('ejs').__express);

var names = ['Windask','Lightbrite','Khey','xBiscuits','Kottonbun','aePheva','DragonSlayer965']

playerWardInformation = getOutput(names)



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
	getOutput(names)
 });

app.listen(process.env.PORT || 7000)

console.log("Listening on port 7000");