console.log("Server.JS Running")

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// for console.log on heroku side
// var logger = require("morgan");
// app.use(logger("dev"));



//Scraping Tools
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Make Public as a Static Folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// GET Articles from Buzzfeed Website (the scrape)
app.get("/scrape", function(req, res){
    axios.get("https://www.buzzfeed.com/").then(function(response){
        var $ = cheerio.load(response.data);
        // Grab Link (a.js-card_ _link.link-gray)
        $("a.js-card__link").each(function(i, element){
            var result = {};
            //Add Text and Href, Save as Properties
            result.title = $(this)
                // .children("a")
                .text();
            result.link = $(this)
                // .children("a")
                .attr("href");
            //Create Article
            console.log("creating article...")
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
            
        });
        res.send("Scrape Complete");
    });
});

//GET Articles from Database
app.get("/articles", function(req, res){
    db.Article.find({}).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

// GET Specific Article (by id)
app.get("/articles/:id", function(req, res){
    db.Article.findOne({_id: req.params.id}).populate("note").then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });

});

// POST Note Belonging to Article
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body).then(function(dbNote){
        return db.Article.findOneAndUpdate({_id:req.params.id}, {note:dbNote._id}, {new:true});
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

// Server
app.listen(PORT, function(){
    console.log("App running on port ", PORT);
});