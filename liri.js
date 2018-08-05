//read and rquire dotenv package
require("dotenv").config();

//import all the shizzzz we needzzzzz
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");

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

    
        console.log("Artist: " + artist);
        console.log("Album: " + album);
        console.log("Release date: " + release);
        console.log("Song name: " + song);


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
            console.log("Movie title: " + JSON.parse(body).Title);
            console.log("Release date: " + JSON.parse(body).Year);
            console.log("Rating: " + JSON.parse(body).imdbRating);
            //rotten tomatoes rating
            if(JSON.parse(body).Ratings[1]){
                console.log("Rotten tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            }
            console.log("Produced in " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        
        } else{

            console.log(err);
        }



    });


}


function randomThing(){

    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){

            console.log(error);
        }

        var strInd = data.search(/,/);
        var randomSong = data.slice((strInd + 2), (data.length - 1));
        console.log(randomSong);
        spotSearch(randomSong);





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
                randomThing();
                break;
        }


    });







