import httplib2
import time 
import json

names = ['Windask', 'LightBrite','Khey','xBiscuits','Kottonbun','DragonSlayer965','aePheva']

#API supports up to 40 summoner GETs at a time. Maybe consider doing this to have less API requests
def get_ward_count(name,apikey = "ebacf303-2d6a-4cda-b132-260e8155f0bc"):
	summoner_name = name
	url_summoner = "https://prod.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + summoner_name + "?api_key=" + apikey
	http = httplib2.Http()
	_, content = http.request(url_summoner, 'GET')
	data = json.loads(content)
	#get summoner ID
	summoner_id = data[summoner_name.lower()]['id']
	url = "https://prod.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + str(summoner_id) + "/recent?api_key=" + apikey
	http = httplib2.Http()
	_, content = http.request(url, 'GET')
	data = json.loads(content)

	def get_ward_count_from_summoner(data):
		count = 0
		index = 0
		data = data['games']
		while index < len(data):
			try:
				count += data[index]['stats']['wardPlaced']
			except KeyError:
				pass
			index += 1
		return count

	return get_ward_count_from_summoner(data)

#Goes through list of names and calculates # of wards
def get_ward_counts(names):
	print "Ward Counts:"
	counter = 0
	for name in names:
		print name + ": " + str(get_ward_count(name))
		counter += 1
		if counter == 4:
			#API Limit
			time.sleep(10)
			counter = 0

get_ward_counts(names)