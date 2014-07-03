var http = require('http');
var db = require('./database.js')

function getOutput(name){ return function(callback2, err2){
		var apikey= "ebacf303-2d6a-4cda-b132-260e8155f0bc"
		lowerName = name.replace(/\s+/g, '');
		console.log(lowerName)		
		
		Summoner.find({lowercase: lowerName.toLowerCase()}, function (err, summonerID) {				        	
			if (err) return console.error(err);
			if (!summonerID.length){
				var url = 'http://prod.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + name.toLowerCase() + "?api_key=" + apikey;		
				http.get(url, function(res) {
				    var body = '';
				    res.on('data', function(chunk) {
				        body += chunk;
				    });
				    res.on('end', function() {
				    	try{
				       		var summonerInfo = JSON.parse(body);
				       		console.log(summonerInfo);
				       		var summoner_id = summonerInfo[lowerName.toLowerCase()]['id'];
				        	name = summonerInfo[lowerName.toLowerCase()]['name'];

				    	}
				        catch (e){
							if (res.statusCode == 404) {
								console.log("Error Caught: Bad summoner name");
								err2("Bad summoner name: Please try again.");
							}
							else if (res.statusCode == 429) {
								console.log("Rate limit reached.  Please try again.");
								err2("Rate limit reached.  Please try again.");
							}
							else{
								err2("Please try again.");
							}
							return false
						}
						getWards(summoner_id,name,apikey)(
							function(callback3){
								callback2(callback3)
							},
							function(err3){
								err2(err3)
							}
						);
				    });
				}).on('error', function(e) {
				      console.log("Got error: ", e);
				});
			}
			else{
				name = summonerID[0]['name']
				summoner_id = summonerID[0]['ID']
				getWards(summoner_id,name,apikey)(
					function(callback3){
						callback2(callback3)
					},
					function(err3){
						err2(err3)
					}
				);
			}
	})
}}

function getWards(summoner_id,name,apikey){ return function(callback3, err3){
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
		        	if (res.statusCode == 404) {
						console.log("Summoner history does not exist.  Please try again.");
						err3("Summoner history does not exist.  Please try again.");
					}
					else if (res.statusCode == 429) {
						console.log("Rate limit reached.  Please try again.");
						err3("Rate limit reached.  Please try again.");
					}
					else{
						err3("Please try again.");
					}
		        	return false
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
						if (res.statusCode == 404) {
							console.log("Summoner history does not exist.  Please try again.");
							err3("Summoner history does not exist.  Please try again.");
						}
						else if (res.statusCode == 429) {
							console.log("Rate limit reached.  Please try again.");
							err3("Rate limit reached.  Please try again.");
						}
						else{
							err3("Please try again.");
						}
						return false
					}
				}
				console.log(wards)
				var summoners = new Summoner({ name: name, ID: summoner_id, lowercase: name.toLowerCase(), wards: wards, sightWardsBought: sightWardsBought, show: true});
				Summoner.find({lowercase: name.toLowerCase()}, function (err, summoner) {
					if (err) return console.error(err);
					if (!summoner.length){
						summoners.save(function (err, summoner) {
						console.log("SUCCESSSAVE")
						});
					}
					else{
						Summoner.update({lowercase: name.toLowerCase()}, { wards: wards, sightWardsBought: sightWardsBought, show: true}, function (err, summoner) {
							console.log("SUCCESSUPDATE");
						});
					}
				})
				var name_ward = new Array();
				name_ward[0] = name
				name_ward[1] = wards
				callback3(name_ward)

		    });
		}).on('error', function(e) {
		      console.log("Got error: ", e);
		});
	}
	catch (e){
		console.log("Error Caught")
	}
}}

module.exports = getOutput