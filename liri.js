//Twitter config
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter(keys.twitterKeys);
var params = {
	screen_name: "carvbowes",
	count: 2
}

//Spotify config
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: '06de408f823c46b7921e97879bff734b',
  secret: '7419baf2c1dc46f9802f8989a360a1ca'
});

//Request
var request = require("request");

var fs = require("fs");

var command = process.argv[2];
var search = process.argv[3];

function showTweets() {
	client.get("statuses/user_timeline", params, function(error, response, body) {
////////////////////////other condition?????????????????????? //////////////////
			if (!error) {
				console.log("****************");
				for (var i=0; i<response.length; i++) {
					console.log("-----" + response[i].created_at + "-----");
					console.log(response[i].text)
				}
				console.log("****************");

			} else {
				console.log(error);
			}
	});
}

function songData(query) {
	spotify.search({ type: 'track', query: query }, function(err, data) {
		if (err) {
	    	return console.log(err);
	  	}
	  	var obj = data.tracks.items[0];

	 	console.log("****************");
		console.log("Artist: " + obj.artists[0].name);
		console.log("Song: " + obj.name);
		console.log("Preview URL: " + obj.preview_url);
		console.log("Album: " + obj.album.name);
		console.log("****************");
	});
}

function movieData(query) {
	request(query, function(error, response, body) {
  	
	  	if (!error && response.statusCode === 200) {
			var obj = JSON.parse(body);

			console.log("****************");
			console.log("Title: " + obj["Title"]);
			console.log("Year: " + obj["Year"]);
			console.log("IMDB Rating: " + obj["Ratings"][0]["Value"]);
			console.log("Rotten Tomatoes Rating: " + obj["Ratings"][1]["Value"]);
			console.log("Country: " + obj["Country"]);
			console.log("Language: " + obj["Language"]);
			console.log("Plot: " + obj["Plot"]);
			console.log("Cast: " + obj["Actors"]);
			console.log("****************");

		} else {
			console.log(error);
		}
	});
}

function randomCommand() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}

		data = data.split(",");
		var tempCommand = data[0];
		//not sure about this method of removing quotes
		var tempSearch = data[1].substring(1, data[1].length-1);

		interpret(tempCommand, tempSearch);

	})
}

function interpret(com, q) {	//interprets console input
	switch(com) {
		case "my-tweets": {
			showTweets();
			break;
		}

		case "spotify-this-song": {
			var title;
			if (!q) {
				title = "The Sign";
			} else {
				title = q;
			}

			songData(title);

			break;
		}

		case "movie-this": {
			var title;

			if (!q) {
				title = "Mr. Nobody";
			} else {
				title = q;
			}

			var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";

			movieData(queryUrl);

			break;
		}

		case "do-what-it-says": {
			randomCommand();
			break;
		}

		default:
			console.log("Sorry, that made no sense");
	}
}


interpret(command, search);

