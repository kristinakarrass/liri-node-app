// grab the fs package to handle writing results in results.txt file
var fs = require("fs");
// Include the request npm package
var request = require('request');
//grab user input and convert them into variables
var command = process.argv[2];
var inputArr = process.argv;
var title = "";
var results = "";
var answer = [];

//convert input to title variable for movie-this and spotify-this-song
if (!inputArr[4]) {
    title = inputArr[3];
} else {
    for (var i = 3; i < inputArr.length; i++) {
        if (i > 3 && i < inputArr.length) {
            title += "+" + inputArr[i];
        }
    } //ends for loop
}

function commandInput() {
    //ask for a valid input if the user has not provided one
    if (!command) {
        console.log("Please give us a valid command: my-tweets, spotify-this-song, movie-this or do-what-it-says.");
    } else {
        //run appropriate command
        switch (command) {
            case "my-tweets":
                tweets();
                break;

            case "spotify-this-song":
                spotify(title);
                break;

            case "movie-this":
                movie(title);
                break;

            case "do-what-it-says":
                doWhatItSays();
                break;
        }
    }
} // closes function commandInput

function tweets() {
    var keys = require('./keys.js');
    //store keys in variables
    var tConsumerKey = keys.twitterKeys.consumer_key;
    var tConsuerSecret = keys.twitterKeys.consumer_secret;
    var tAccessKey = keys.twitterKeys.access_token_key;
    var tAccessSecret = keys.twitterKeys.access_token_secret;
    //include the twitter npm package
    var Twitter = require('twitter');
    var client = new Twitter({
        consumer_key: tConsumerKey,
        consumer_secret: tConsuerSecret,
        access_token_key: tAccessKey,
        access_token_secret: tAccessSecret
    });
    // Then run a request to the Twitter API to capture last 20 tweets from your account
    var params = { screen_name: 'ConsoleLogger' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            fs.appendFileSync("results.txt", "\n" + "20 most recent tweets: " + "\n");
            for (var i = 0; i < tweets.length; i++) {
                console.log("===================================================================================================");
                console.log("");
                console.log(tweets[i].text);
                console.log("");
                console.log(tweets[i].created_at);
                console.log("");
                console.log("===================================================================================================");
                fs.appendFileSync("results.txt", "\n" + tweets[i].created_at + "\n");
                fs.appendFileSync("results.txt", "\n" + tweets[i].text + "\n\n");
                fs.appendFileSync("results.txt", "=============================================================================================");

                if (i === 20) {
                    return;
                }
            } //ends for loop
        } // ends if not error
    }); // ends client get function
}; // end tweets function

function spotify() {
    var spotify = require("spotify");
    // var title = process.argv[3];
    if (!title) {
        //query for the song "The Sign" of Ace of Base if no user input available
        spotify.search({ type: "track", query: "The Sign" }, function(err, data) {
            var result = data.tracks.items[3];
            console.log("==============================================================================");
            console.log("");
            console.log("Artist: " + result.artists[0].name);
            console.log("Song: " + result.name);
            console.log("Preview URL: " + result.preview_url);
            console.log("Album name: " + result.album.name);
            console.log("");
            console.log("==============================================================================");
        })
    } else {
        spotify.search({ type: "track", query: title }, function(err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                } else {
                    //use first available track and put data in variable
                    var result = data.tracks.items[1];
                    console.log("==============================================================================");
                    console.log("");
                    console.log("Artist: " + result.artists[0].name);
                    console.log("Song: " + result.name);
                    console.log("Preview URL: " + result.preview_url);
                    console.log("Album name: " + result.album.name);
                    console.log("");
                    console.log("==============================================================================");
                }
            }) //end search query
    }
} //end spotify function

function movie() {
    // if there is no title provided, print out information for Mr Nobody
    if (!title) {
        title = "Mr.Nobody";
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json&tomatoes=true";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover title, year, IMDB rating, country, language, plot, actors, rotten tomatoes
            console.log("==============================================================================");
            console.log("");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoURL);
            console.log("");
            console.log("==============================================================================");
        }
    });
} // end movie function

function doWhatItSays() {
    fs = require("fs");
    fs.readFile("random.txt", "utf8", function(error, data) {
        // console.log(data);
        var dataArr = data.split(",");
        command = dataArr[0];
        title = dataArr[1];
        //replace spaces in title with plus sign for OMDB request
        if (command === "movie-this") {
            title = title.replace(/ /gi, "+");
            // console.log(title);
        }
        commandInput(command, title);
    })
}

// function appendResults(){
// // We append the results of our searches into the file
// // If the file didn't exist then it gets created on the fly.
// fs.appendFile(results.txt, results, function(err) {

//   // If an error was experienced we say it.
//   if (err) {
//     console.log(err);
//   }

//   // If no error is experienced, we'll log the phrase "Content Added" to our node console.
//   else {
//     console.log("Content Added!");
//   }

// });
// }

commandInput(command, title);
