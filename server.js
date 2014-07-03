var express = require('express');
var app  = express();
var server = require('http').createServer(app);
var path = require('path');
var http = require('http');

var getOutput = require('./js/wardInformationScrapper') //provides dict of names
var smtpTransport = require("./js/mailer");
var db = require('./js/database')

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('./css'));
app.use(express.static('./js'));
app.set('view engine', 'html');

app.engine('.html', require('ejs').__express);

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

	var ipAddr = req.headers["x-forwarded-for"];
	if (ipAddr){
	    var list = ipAddr.split(",");
	    ipAddr = list[list.length-1];
	  } else {
	    ipAddr = req.connection.remoteAddress;
	  }

	var date = new Date();
	console.log(date)
	var queryRequests = new queryRequest({IP : ipAddr, name : summonerName, time : date});
	queryRequests.save(function (err, queryRequest) {
		console.log("Query has been logged.")
	});			

	getOutput(summonerName)(
		function (callback) {
		    res.send(callback)
		    summonerName = callback[0]
		    // setup e-mail data with unicode symbols
			var mailOptions = {
			    from: "Wards Notifier<ryanwardapp@gmail.com>", // sender address
			    to: "ryanwardapp@gmail.com", // list of receivers
			    subject: "Automated Information", // Subject line
			    text: ipAddr + " requested for Summoner: " + summonerName, // plaintext body
			    html: ipAddr + " requested for Summoner: " + summonerName // html body
			}
			
			
			smtpTransport.sendMail(mailOptions, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			    }
			});
			
			
		},
		function (err){
			res.send(405, err);
			var mailOptions = {
			    from: "Wards<ryanwardapp@gmail.com>", // sender address
			    to: "ryanwardapp@gmail.com", // list of receivers
			    subject: "Automated Information", // Subject line
			    text: ipAddr + " requested for Summoner: " + summonerName + ".  Unfortunately it failed", // plaintext body
			    html: ipAddr + " requested for Summoner: " + summonerName + ".  Unfortunately it failed"// html body
			}
			smtpTransport.sendMail(mailOptions, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			    }
			});
		}
	);

});

app.listen(process.env.PORT || 7000)

console.log("Listening on port 7000");