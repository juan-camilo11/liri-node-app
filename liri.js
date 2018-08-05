//read and rquire dotenv package
require("dotenv").config();

//import all the shizzzz we needzzzzz
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");

//Spotify key initializtion
var spotify = new Spotify(keys.spotify);

//spotify seach function, takes the song the user inputs into the console and displays relevant info
function spotSearch(song){
    spotify.search({type: 'track', query: song, limit: "1"}, function(err, data){
    
        if(err){
            console.log(err);
        }
    
        var artist = data.tracks.items[0].album.artists[0].name;
        var song = data.tracks.items[0].name;
        var album = data.tracks.items[0].album.name;
        var release = data.tracks.items[0].album.release_date;

    
        console.log(artist);
        console.log(album);
        console.log(release);
        console.log(song);


    });
}

//IMDB API search function, takes whatever movie the user requested and returns the relevant information
function movieSearch(movie){
    var movieName = movie;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body){

        if(!err && response.statusCode === 200){

            //need to look at responses from IMDB, responses seem to change based on the movie
            //also if possible add some input validation
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).imdbRating);
            //rotten tomatoes rating
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
        
        } else{

            console.log(err);
        }



    });


}

//dont have API for twitter yet, I think
// var Twitter = require();



/////////inquirer shit requesting user input
inquirer
    .prompt([
        {
            type: "list",
            message: "Select your command:",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"

        }

    ]).then(function(userResponse){

        switch(userResponse.command) {
            case "my-tweets":
                break;
            case "spotify-this-song":
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What song would you like to search?",
                            name: "song"

                        },
                        {
                            type: "confirm",
                            message: "Are you sure?",
                            name: "confirm",
                            default: true
                        }

                    ]).then(function(resp){
                        if(resp.confirm){
                            spotSearch(resp.song);
                        } else {
                            console.log("Maybe next time then!");
                        }

                    });
                break;
            case "movie-this":
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What movie would you like to search?",
                            name: "movie"

                        },
                        {
                            type: "confirm",
                            message: "Are you sure?",
                            name: "confirm",
                            default: true
                        }

                    ]).then(function(resp){
                        if(resp.confirm){
                            movieSearch(resp.movie);
                        } else {
                            console.log("Maybe next time then!");
                        }

                    });
                break;
            case "do-what-it-says":
                break;
        }


    });







