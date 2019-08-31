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

//In server.js, you need to have port point to process.env.PORT:
var PORT = process.env.PORT || 3000;
// you need to connect mongo from heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// you need to store it in a variable
mongoose.connect(MONGODB_URI); (edited) 

var app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Make Public as a Static Folder
app.use(express.static("public"));

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI, {useNewURLParser: true, useCreateIndex: true, useFindAndModify: false});
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

//route to the index page
app.get("/", function(req, res){
    res.redirect("index");
});
//get articles that have been saved
app.get("/articles", function(req, res){
    console.log(`articles that have been save$$$$$$`)
    db.Article.find({saved: true}).then(function(dbArticle){
        var obj={
            articles: dbArticle
        }
        res.render("articles", obj);
    }).catch(function(err){
        res.json(err);
    })
});


// GET Articles from Buzzfeed Website (the scrape)
app.get("/scrape", function(req, res){
    axios.get("https://www.buzzfeed.com/").then(function(response){
        var $ = cheerio.load(response.data);
        // Grab Link 
       console.log("SCRAPING")     
       $(".story-card").each(function(i, element){
            var result = {};
            //Add Text and Href, Save as Properties
           
            result.title = $(this).find("a.js-card__link")
                .text();
           
                result.link = $(this).find("a.js-card__link")
                .attr("href");
             
                result.img = $(this).find("img.js-progressive-image")
                .attr("src");

                result.description = $(this).find("p.js-card__description")
                
                .text(); 
                // console.log(result.description, "DESCRIPTION^^^^^^^^^^^")
                // console.log(result.img,"IMAGE**************")
            //Create Article
            console.log("creating article...", result)
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
            
        });
       res.redirect("index")
    });
});

//GET Articles from Database and display index
app.get("/index", function(req, res){
    db.Article.find({saved: false}).then(function(dbArticle){
        //just for info, needs to be in json
        var obj={
            articles: dbArticle
        }
        res.render("index", obj);
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


//Route for saving/updating Article's note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


// PUT Article in Saved Articles
app.put("/articles/:id", function(req, res){

    db.Article.findOneAndUpdate({ _id: req.params.id},
   {$set:{saved: true}}).then(function(dbArticle){
       
       console.log(dbArticle)
        res.json(dbArticle);
    }).catch(function(err){

        console.log(err)
    });
});

// POST Saved Articles to Article Page
app.post("/articles", function(req, res){
    db.Article.create(req.body).then(function(dbArticle){
        res.json(dbArticle);
    });
});


// POST Note Belonging to Article
app.post("/articles/:id", function(req, res){
    console.log("/articles POST BY ID&&&&&&&&&&&&")
    db.Note.create(req.body).then(function(dbNote){
        console.log("/articles POST BY ID in create")
        return db.Article.findOneAndUpdate(
            //possibly need to delete underscore
            {_id:req.params.id}, {note:dbNote._id}, {new:true});
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

// DELETE Article By Id
app.delete("/articles/:id", function(req, res){
    console.log("/articles delete")
    db.Article.destroy({ where: { id: req.params.id}
    }).then(function(dbArticle){
        res.json(dbArticle);
    });
});




// Server
app.listen(PORT, function(){
    console.log("App running on port ", PORT);
});