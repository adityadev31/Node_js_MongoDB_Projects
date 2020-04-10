//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
const _ = require("lodash");
const mongoose = require("mongoose");
// const ejs = require("ejs");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

mongoose.connect("mongodb://localhost:27017/PostDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const posts = mongoose.Schema({
  title: String,
  description: String
});

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Post = mongoose.model("post", posts);
const UserModel = mongoose.model('users', userSchema);

const homeStartingContent = "Feel free to post your stories or blogs";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// let posts = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


function checkLoggedIn(req, res, next){
  var loggedIn = localStorage.getItem('myloginBox');
  try {
    var decoded = jwt.verify(loggedIn, 'loginToken');
  } catch(err) {
    res.render('login', { 'msg': 'Login first !!' });
  }
  next();
}

app.get("/home", checkLoggedIn, (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", checkLoggedIn, (req, res) => {
  res.render("compose");
});

app.post("/compose",checkLoggedIn ,(req, res) => {
  const post = new Post({
    title: req.body.titleName,
    description: req.body.blogContent
  });
  post.save(err => {
    if (!err) res.redirect("/home");
  });
});

app.get("/posts/:postId", checkLoggedIn, (req, res) => {
  const postId = req.params.postId;
  Post.findById({ _id: postId }, (err, postfound) => {
    if (!err) {
      res.render("post", {
        postTitle: postfound.title,
        postContent: postfound.description
      });
    }
  });
});


app.get('/', function(req, res, next){
  var logBox = localStorage.getItem('myloginBox');
  if(logBox){
    res.redirect('/home');
  }
  else{
    res.render('login', { 'msg': '' });
  }
});
app.get('/login', function(req, res, next){
  var logBox = localStorage.getItem('myloginBox');
  if(logBox){
    res.redirect('/home');
  }
  else{
    res.render('login', { 'msg': '' });
  }
});

app.post('/loginaction', function(req, res, next){
  var userEmail = UserModel.findOne({email: req.body.email});
  userEmail.exec(function(err, data){
    if(data){    // user exists check for password
      if(data.password == req.body.password){    // password matches
        var token = jwt.sign({ foo: 'bar' }, 'loginToken');
        localStorage.setItem('myloginBox', token);
        var getPost = Post.find({});
        getPost.exec(function(err, allPosts){
          res.render("home", {
            homeStartingContent: homeStartingContent,
            posts: allPosts
          });
        });
      }
      else{   // password not matched
        res.render('login', { 'msg': 'Password not matched !' });
      }
    }
    else{    // user dont exist redirect to signup page
      res.render('signup', { 'msg': 'User not exists.. Register first !' });
    }
  });
});


app.get('/signup', function(req, res, next){
  var logBox = localStorage.getItem('myloginBox');
  if(logBox){
    res.redirect('/home');
  }
  else{
    res.render('signup', { 'msg': '' });
  }
});

app.post('/signupaction', function(req, res, next){
  var userExists = UserModel.findOne({email: req.body.email});
  userExists.exec(function(err, data){
    if(err) throw err;
    else{
      if(data){ res.render('login', { 'msg': 'user already exists.. login!' }); }   // user alredy exists
      else{   // creating new user
        var newUser = new UserModel({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        console.log(newUser);
        newUser.save();
        res.render('login', { 'msg': 'user registered successfully.. login!' });
      }
    }
  });
});


app.get('/logout',checkLoggedIn , function(req, res, next){
  localStorage.removeItem('myloginBox');
  res.render('login', { 'msg': 'Logged out Successfully !!' });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
