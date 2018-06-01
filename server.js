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


//GET ROUTES
//POST ROUTES 

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });