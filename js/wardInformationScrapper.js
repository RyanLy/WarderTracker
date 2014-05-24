var http = require('http');
var rateLimit = require('function-rate-limit');

var getOutput = function getOutput(names){
	var jsonOutput = {};

	for (name in names){
		jsonOutput[names[name].toLowerCase()] = 0
	}
		
	var fn = rateLimit(2,5000,function(x){
		jsonParse(x);
	});

	for (name in names){
		fn(names[name.toLowerCase()]);
	}

	function jsonParse(name){
		var apikey= "ebacf303-2d6a-4cda-b132-260e8155f0bc"
		var url = 'http://prod.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name + "?api_key=" + apikey;
		console.log(name)

		output = ""

		http.get(url, function(res) {
		    var body = '';
		    res.on('data', function(chunk) {
		        body += chunk;
		    });
		    res.on('end', function() {
		        var summonerInfo = JSON.parse(body)
		        try{
		        	var summoner_id = summonerInfo[name.toLowerCase()]['id'];
		    	}
		        catch (e){
					console.log("Error Caught");
				}
		        console.log(summoner_id);
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
			        var summonerGamesInfo = JSON.parse(body)
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
							console.log("Error Caught");
						}
					}
					console.log(wards)
					jsonOutput[name.toLowerCase()] = "Wards placed: " + wards
					jsonOutput[name.toLowerCase()] += ", Sightwards bought in ten games: " + sightWardsBought
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