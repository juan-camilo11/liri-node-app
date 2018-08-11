//read and rquire dotenv package
require("dotenv").config();

//import all the shizzzz we needzzzzz
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const inquirer = require("inquirer");
const fs = require("fs");

//Spotify key initializtion
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);



//twitter search function
let tweetSearch = (userName) => {
    let count = 0;
    console.log(userName);
    let params = {screen_name: userName};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if(!error){
            tweets.forEach(function(stuff){
                if(count < 20){
                    count ++;
                    console.log(stuff.text);
                    console.log(stuff.created_at);
                    console.log(`\n`);
                } else {

                }

            });
        } else {
            console.log(error);
        }

    });
    count = 0;
}

//spotify seach function, takes the song the user inputs into the console and displays relevant info
function spotSearch(song){

    if(!song){
        var daSong = "The Sign";
    } else{
        daSong = song
    }
    spotify.search({type: 'track', query: daSong, limit: "1"}, function(err, data){
    
        if(err){
            console.log(err);
        }
    
        let artist = data.tracks.items[0].album.artists[0].name;
        let songName = data.tracks.items[0].name;
        let album = data.tracks.items[0].album.name;
        let release = data.tracks.items[0].album.release_date;

    
        console.log("Artist: " + artist);
        console.log("Album: " + album);
        console.log("Release date: " + release);
        console.log("Song name: " + songName);


    });
}

//IMDB API search function, takes whatever movie the user requested and returns the relevant information
function movieSearch(movie){
    if(!movie){
        var movieName = "Mr. Nobody";
    } else{
        movieName = movie;
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

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

        let strInd = data.search(/,/);
        let randomSong = data.slice((strInd + 2), (data.length - 1));
        console.log(randomSong);
        spotSearch(randomSong);





    });
}




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
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Which twitter account would you like to search?",
                            name: "username"
                        },
                        {
                            type: "confirm",
                            message: "Are you sure",
                            name: "confirm",
                            default: true
                        }
                    ]).then(function(resp){
                        if(resp.confirm){
                            tweetSearch(resp.username);
                            let command = "Command: " + JSON.stringify(userResponse.command) + "\n";
                            let newline = "\n";
                            fs.appendFileSync("log.txt", command, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
                            fs.appendFileSync("log.txt", newline, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });

                        } else {
                            console.log("Maybe next time then!");
                        }

                    });
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
                            let command = "Command: " + JSON.stringify(userResponse.command) + "\n";
                            if(resp.song){
                                var songChosen = "Song searched: " + resp.song + "\n"; 
                            } else{
                                songChosen = "Song searched: The Sign \n";
                            }
                            let newline = "\n";
                            fs.appendFileSync("log.txt", command, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
                            fs.appendFileSync("log.txt", songChosen, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
                            fs.appendFileSync("log.txt", newline, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
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
                        console.log(resp.movie);
                        if(resp.confirm){
                            movieSearch(resp.movie);
                            let command = "Command: " + JSON.stringify(userResponse.command) + "\n";
                            if(resp.movie){
                                var movieChosen = "Movie searched: " + resp.movie + "\n"; 
                            } else{
                                movieChosen = "Movie searched: Mr.Nobody \n";
                            }
                            let newline = "\n";
                            fs.appendFileSync("log.txt", command, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
                            fs.appendFileSync("log.txt", movieChosen, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
                            fs.appendFileSync("log.txt", newline, "utf8", function(err){
                                if (err) {
                                    return console.log(err);
                                }


                            });
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







