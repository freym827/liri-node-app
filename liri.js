require("dotenv").config();

var Keys = require("./keys.js")
var request = require('request');

//var spotify = new Spotify(keys.spotify);

var whattodo = process.argv[2];

if(whattodo == "concert-this") {

}

if(whattodo == "spotify-this-song") {

}

if(whattodo == "movie-this") {
    var movie = "Mr. Nobody"
    for(i=3;i<process.argv.length;i++) {
        if(i==3) {
            movie = process.argv[3]
        }else {
            movie = movie + " " + process.argv[i];
        }
    }
    if(movie == "") {
        movie = "Mr. Nobody"
    }
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryURL, { json: true }, function (error, response, body) {
        if(error) {
            console.log("Error: " + error)
        }else if(body.Title == null) {
            console.log("This is not a movie")
        } else {
            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("imdb Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Score: " + body.Ratings[1].Value)
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Actors: " + body.Actors);
        }
    });
}

if(whattodo == "do-what-it-says") {

}