var http = require('http');
var mongoose = require('mongoose');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/';


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
var Summoner = mongoose.model('Summoner', summonerSchema)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("SUCCESSDB");
});

var getOutput = function getOutput(name){
	var jsonOutput = {};

	var fn = rateLimit(2,1000,function(x){
		jsonParse(x);
	});

	jsonParse(name)

	function jsonParse(name){
		var apikey= "ebacf303-2d6a-4cda-b132-260e8155f0bc"
		var url = 'http://prod.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name.toLowerCase() + "?api_key=" + apikey;

		output = ""

		http.get(url, function(res) {
		    var body = '';
		    res.on('data', function(chunk) {
		        body += chunk;
		    });
		    res.on('end', function() {
		    	try{
		       		var summonerInfo = JSON.parse(body);
		       		console.log(summonerInfo);
		       		lowerName = name.replace(/\s+/g, '');
		       		console.log(lowerName)
		        	var summoner_id = summonerInfo[lowerName.toLowerCase()]['id'];
		        	name = summonerInfo[lowerName.toLowerCase()]['name'];

		    	}
		        catch (e){
					console.log("Error Caught: Bad summoner name");
					return false;
				}
		        getWards(summoner_id,name,apikey);
		    });
		}).on('error', function(e) {
		      console.log("Got error: ", e);
		});

	}

	function getWards(summoner_id,name,apikey){
		var url = "http://prod.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + summoner_id + "/recent?api_key=" + apikey
		try{
			http.get(url, function(res) {
			    var body = '';
			    res.on('data', function(chunk) {
			        body += chunk;
			    });
			    res.on('end', function() {
			    	try{
			        	var summonerGamesInfo = JSON.parse(body)
			        }
			        catch(e){
			        	console.log("Does not exist")
			        	return false;
			        }
			        //console.log(summonerGamesInfo)
			        wards = 0
			        sightWardsBought = 0
					for (game in summonerGamesInfo.games){
						try{
				        	tempWardsPlaced = summonerGamesInfo['games'][game]['stats']['wardPlaced']
				        	temp = summonerGamesInfo['games'][game]['stats']['sightWardsBought']
				        	if (!isNaN(tempWardsPlaced)){
				     			wards += tempWardsPlaced
				        	}
				        	if (!isNaN(temp)){
				        		sightWardsBought += temp
				        	}
				    	}
				        catch (e){
							console.log("Error Caught: No Recent History");
						}
					}
					console.log(wards)
					var summoners = new Summoner({ name: name, lowercase: name.toLowerCase(), wards: wards, sightWardsBought: sightWardsBought});
					Summoner.find({lowercase: name.toLowerCase()}, function (err, summoner) {
						if (err) return console.error(err);
						if (!summoner.length){
							summoners.save(function (err, summoner) {
							console.log("SUCCESSSAVE")
							});
						}
						else{
							summoners.update(function (err, summoner) {
							console.log("SUCCESSUPDATE")
							});
						}
					})

			    });
			}).on('error', function(e) {
			      console.log("Got error: ", e);
			});
		}
		catch (e){
			console.log("Error Caught")
		}
	}
	return jsonOutput
}

module.exports = getOutput