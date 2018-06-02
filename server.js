var express = require("express");
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require("cheerio");
// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.use(bodyParser.json());
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//GET ROUTES
//POST ROUTES 

// Main route (test)
app.get('/', function (req, res) {
    res.render('index');
});

// A GET route for scraping 
app.get("/scrape", function(req, res) {
// Making a request for allrecipes, healthy category. The page's HTML is passed as the callback's third argument
request("https://www.allrecipes.com/recipes/84/healthy-recipes/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  if (error){
    return res.json(error);
  }
  
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each h3 with the "fixed-recipe-card__h3" class
  // (i: iterator. element: the current element)
  $("img.fixed-recipe-card__img").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).attr("title");

    var imgURL = $(element).attr("data-original-src");
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).parent().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    if (title && imgURL && link){
      results.push({
        title: title,
        imgURL: imgURL,
        link: link
      });
    }
  });

  // Create a new Article using the `result` object built from scraping
  db.Article.create(results)
    .then(function(dbArticle) {
      return res.status(200).send();
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
  });
});

//get all articles from db 
app.get("/articles", (req, res) => {
  db.Article.find({}).then(function (dbArticle) {
      // res.json(dbArticle);
      res.send(dbArticle);
  })
      .catch(function (err) {
          res.json(err);
      });
});


//save article route //update... save=true 
//delete article route
//post comment route
//delete comment route 


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });