// make switch function a function to be called at beginning and in do what it says funtion

// Include the request npm package
var request = require('request');

var command = process.argv[2];

switch (command) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        var title = process.argv[3];
        spotify(title);
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}

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
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                if (i === 20) {
                    return;
                }
            } //ends for loop
        } // ends if not error
    }); // ends client get function
}; // end tweets function



function spotify(title) {
    var spotify = require("spotify");
    // var title = process.argv[3];
    if (!title) {
        //query for the song "The Sign" of Ace of Base if no user input available
        spotify.search({ type: "track", query: "The Sign" }, function(err, data) {
            var result = data.tracks.items[3];
            console.log("Artist: " + result.artists[0].name);
            console.log("Song: " + result.name);
            console.log("Preview URL: " + result.preview_url);
            console.log("Album name: " + result.album.name);
        })
    } else {
        spotify.search({ type: "track", query: title }, function(err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                } else {
                    //use first available track and put data in variable
                    var result = data.tracks.items[1];
                    console.log("Artist: " + result.artists[0].name);
                    console.log("Song: " + result.name);
                    console.log("Preview URL: " + result.preview_url);
                    console.log("Album name: " + result.album.name);
                }
            }) //end search query
    }
} //end spotify function



function movie() {
    // puts movie input into variable
    var movieArgs = process.argv;
    var movieName = "";
    // console.log(movieArgs);
    if (!movieArgs[3]) {
        movieName = "Mr.Nobody";
        // console.log(movieName);
    } else {
        movieName = movieArgs[3];
        for (var i = 3; i < movieArgs.length; i++) {
            if (i > 3 && i < movieArgs.length) {
                movieName = movieName + "+" + movieArgs[i];
            }
        } //ends for loop
    } // ends else statement
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
        	// console.log(body);
            // Parse the body of the site and recover title, year, IMDB rating, country, language, plot, actors, rotten tomatoes
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoURL);

        }
    });
} // end movie function


function doWhatItSays() {
    fs = require("fs");
    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArr = data.split(",");
        var command = dataArr[0];
        var title = dataArr[1];
        switch (command) {
            case "my-tweets":
                tweets();
                break;

            case "spotify-this-song":
                spotify(title);
                break;

            case "movie-this":
                movie();
                break;

            case "do-what-it-says":
                doWhatItSays();
                break;
        }
    })
}
