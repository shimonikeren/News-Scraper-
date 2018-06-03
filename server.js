var express = require("express");
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require("cheerio");
var axios = require("axios");
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

app.get('/', function (req, res) {
    res.render('index');
});

// A GET route for scraping recipes
app.get("/scrape", function(req, res) {
request("https://www.allrecipes.com/recipes/84/healthy-recipes/", function(error,     response, html) {
    if (error){
      return res.json(error);
    }
  
  var $ = cheerio.load(html);

  var results = [];

  $("img.fixed-recipe-card__img").each(function(i, element) {
    var title = $(element).attr("title");
    var imgURL = $(element).attr("data-original-src");
    var link = $(element).parent().attr("href");
      if (title && imgURL && link){
        results.push({
          title: title,
          imgURL: imgURL,
          link: link
        });
      }
  });

  // Create a new Article model using the `result` object built from scraping
  db.Article.create(results)
    .then(function(dbArticle) {
      console.log("articles scraped");
    })
    .catch(function(err) {
      return res.json(err);
    });
  });
  res.redirect("/articles");
});

//get all recipes from db 
app.get("/articles", function(req, res){
  console.log("redirected to /articles");
  db.Article.find({}).then(function (dbArticle) {
      res.render("all", { article: dbArticle });
  })
      .catch(function (err) {
          res.json(err);
      });
});

 //save recipe to favorites 
 app.put("/saved/:id", function (req, res){
  db.Article.update({ _id: req.params.id }, { $set: {saved: true }})
      .then(function(dbArticle){
        res.render("saved", { article: dbArticle }); 
      })
      .catch(function(err){
          res.json(err)
      })
})

//unsave recipe / remove from favorites 
app.put("/unsaved/:id", function (req, res){
  db.Article.update({ _id: req.params.id }, { $set: {saved: false }})
      .then(function(dbArticle){
        res.render("saved", { article: dbArticle }); 
      })
      .catch(function(err){
          res.json(err)
      })
})

//GET all saved recipes 
app.get("/saved", function(req, res){
  db.Article.find({}).then(function (dbArticle) {
    res.render("saved", { article: dbArticle });
  })
      .catch(function (err) {
          res.json(err);
      });
});

//get route to comment form (which will have all comments and option to add comment)
app.get("/comment/:id", function(req, res){
  db.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then(function (comments) {
      res.render("comments" , {comments: comments})
    }).catch(function (err) {
          res.json(err);
      });
});

//post route to submit comment 
app.post("/comment/add/:id", function(req, res){
  db.Comment.create(req.body)
    .then(function(dbComment){
      db.Article.findByIdAndUpdate({_id: req.params.id},{$push: {comments: dbComment._id}},{new:true})
    }).then(function(dbComment){
      db.Article.findOne({_id: req.params.id})
      .populate("comment")
      .then(function(comments){
        res.render('comments', {comments: comments});
      })
    }).catch(function (err) {
      res.json(err);
  });
});

//delete comments


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });