import httplib2
import time 
import json

names = ['Windask','LightBrite','Khey','xBiscuits','Kottonbun','DragonSlayer965']

def get_ward_count(name,apikey = "ebacf303-2d6a-4cda-b132-260e8155f0bc"):

	summoner_name = name
	url_summoner = "https://prod.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + summoner_name + "?api_key=" + apikey
	#print url_summoner
	http = httplib2.Http()
	_, content = http.request(url_summoner, 'GET')
	data = json.loads(content)
	#print data
	summoner_id = data[summoner_name.lower()]['id']
	#print summoner_id
	#url_name = re.sub(" ","_",name)
	url = "https://prod.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + str(summoner_id) + "/recent?api_key=ebacf303-2d6a-4cda-b132-260e8155f0bc"
	http = httplib2.Http()
	_, content = http.request(url, 'GET')
	data = json.loads(content)
	#print data

	def traverse(data):
		count = 0
		if not data:
			return
		data = data['games']
		index = 0
		while index < len(data):
			try:
				count += data[index]['stats']['wardPlaced']
			except KeyError:
				pass
			index += 1
		return count
	return traverse(data)

counter = 0
for name in names:
	print name
	print get_ward_count(name)
	counter += 1
	if counter == 5:
		#API Limit
		time.sleep(10)