require("dotenv").config();

var Keys = require("./keys.js")
var request = require('request');
var moment = require('moment');

//var spotify = new Spotify(keys.spotify);

var whattodo = process.argv[2];

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

var isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

if(whattodo == "concert-this") {
    var artist = getThing();
    if(artist == null) {
        artist = "Ace of Base"
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

if(whattodo == "spotify-this-song") {

}

if(whattodo == "movie-this") {
    var movie = getThing()
    if(movie == null) {
        movie = "Mr. Nobody"
    }
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

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
        }
    });
}

if(whattodo == "do-what-it-says") {

}