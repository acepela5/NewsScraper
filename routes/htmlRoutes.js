var db = require("../models");
console.log( "hits html routes")
module.exports = function(app){
    app.get("/", function(req, res){
        db.Article.findAll({}).then(function(dbArticle){
            res.render("index", {

            })
        })
    })
}

app.get("/index", function(req, res){
    res.render("index", {});
});