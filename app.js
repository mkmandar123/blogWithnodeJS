//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent ="This is a simple blog you can click on compose link to compose new post and click on read more to view a particular post.";
 const aboutContent = "This is blog is made just for fun and is not fully completed.";
const contactContent = "You can get in touch with me on mkmandar123@gmail.com.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb+srv://MandarMaster:mandar@619@cluster0-vgmw1.mongodb.net/blogDB",{useNewUrlParser: true,useUnifiedTopology: true});

const postSchema=new mongoose.Schema({
  postTitle:String,
  postBody:String
});

const Post= mongoose.model("post",postSchema);

// const post =new Post({
//   postTitle:"DAY 1",
//   postBody:"This is the day 1 and I'm testing this"
// });
//
// post.save();

app.get("/", function(req, res){
    Post.find({},function(err,docs){
      if(err)
      console.log(err);
      else{
        res.render(__dirname+"home",{startingContent:homeStartingContent,posts:docs});
      }
    });

});

app.get("/about", function(req, res){
  res.render(__dirname+"about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render(__dirname+"contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render(__dirname+"compose");
});

app.post("/compose", function(req, res){
  const post = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  };

  const postCreate =new Post(post);
  postCreate.save();

  res.redirect("/");

});

app.get("/:postID", function(req, res){
  const requestedTitle = req.params.postID;

  Post.findById(requestedTitle,function(err,docs){
    res.render("post",{title:docs.postTitle,content:docs.postBody});
  });


});

app.listen(process.env.PORT || 3000, function() {});
