require("dotenv").config();

//getting files we need
var keys = require("./keys.js")
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

//what function to run
var whattodo = process.argv[2];

//what we put in search query for each funtion
var getThing = function() {
    for(i=3;i<process.argv.length;i++) {
        if(i==3) {
            var thing = process.argv[3]
        }else {
            thing = thing + " " + process.argv[i];
        }
    }
    return thing;
}

//checking for empty objects so we dont try to get the value of an empty object later
var isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
//getting movie info
var moviefun = function(a) {
    //uses either user input, or input from random.txt
    if(a == 1) {
        var movie = getThing()
    }else {
        var movie = a;
    }
    //if we have no input
    if(movie == null) {
        movie = "Mr. Nobody"
    }
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    
    //making call to api, checking for error, checking if a movie is found, and showing information
    request(queryURL, { json: true }, function (error, response, body) {
        if(error) {
            console.log("Error: " + error)
        }else if(body.Title == null) {
            console.log("No one has made this movie yet!")
        } else {
            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("imdb Rating: " + body.imdbRating);
            if(!isEmpty(body.Ratings)) {
                console.log("Rotten Tomatoes Score: " + body.Ratings[1].Value)
            } else {
                console.log("Rotten Tomatoes Score: N/A")
            }
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Actors: " + body.Actors);
            console.log("Plot: " + body.Plot);
        }
    });
}

//getting info, making call, loopint through response to get all concert info
var concertfun = function(a) {
    if(a == 1) {
        var artist = getThing()
    }else {
        //omdb appears to not like quotes in their url
        var artist = a.substring(1, a.length-1);;
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryURL, function (error, response, body) {
        if(error) {
            console.log("Error: " + error)
        } else {
            var jbody = JSON.parse(body)
            if(isEmpty(jbody)){
                console.log("No concert info available")
            } else {
                for(var key in jbody) {
                    var venue = jbody[key].venue.name
                    var city = jbody[key].venue.city
                    var region = jbody[key].venue.region
                    var country = jbody[key].venue.country
                    var datetime = jbody[key].datetime
                    var formtime = moment(datetime).format("MM/DD/YYYY")
                    if(!(region == "")) {
                        region = region + ", "
                    }
                    console.log("Concert " + (Number(key) +1))
                    console.log("    Name of venue: " + venue)
                    console.log("    Location: " + city + ", " + region + country)
                    console.log("    " + formtime)
                }
            }
        }
    });
}

//getting info, searching spotify, going through weird response to find normal info
var spotifyfun = function(a) {
    if(a == 1) {
        var song = getThing()
    } else {
        var song = a;
    }
    if(song == null) {
        song = "The Sign"
    }
    
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name); 
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log("Song: " + data.tracks.items[0].name)
        console.log(data.tracks.items[0].external_urls.spotify)
      });
}

//when we use each function. passing in which route we would like to take
if(whattodo == "concert-this") {
    concertfun(1)
}

if(whattodo == "spotify-this-song") {
    spotifyfun(1)
}

if(whattodo == "movie-this") {
    moviefun(1)
}

//reading file random.txt, splitting between the command and the search info,
//passing search info into the functions we made
if(whattodo == "do-what-it-says") {
    fs.readFile('random.txt', "utf-8", function(err, data) {
        var arr = data.split(",")
        if(arr[0] == "spotify-this-song") {
            spotifyfun(arr[1])
        }else if(arr[0] == "movie-this") {
            moviefun(arr[1])
        }else if(arr[0] == "concert-this") {
            concertfun(arr[1])
        }
    });
}