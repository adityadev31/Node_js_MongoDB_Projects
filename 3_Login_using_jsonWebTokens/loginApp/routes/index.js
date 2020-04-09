var express = require('express');
var jwt = require('jsonwebtoken');        // json web token   (step 1)
var router = express.Router();

// node-localstorage  (step 2)
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


// login GET (step 3)
router.get('/login', function(req,res,next){
  var token = jwt.sign({ foo: 'bar' }, 'loginToken'); // makin token for login  and naming  it 'loginToken'
  localStorage.setItem('myToken', token); // making a local storage named 'myToken' and inserting token (loginToken) in it
  res.send('Login Success');
});


// middleware check login token
function checkLogin(req,res,next){
  var myToken = localStorage.getItem('myToken');
  try {
    jwt.verify(myToken, 'loginToken'); // checking whether the box - myToken contains loginToken or not
  } catch(err) {
    res.send('You need login first !');
  }
  next();
}


// homepage GET (step 4)
router.get('/home', checkLogin, function(req,res,next){
  res.render('homepage');
});


// logout GET (step 5)
router.get('/logout', function(req, res, next){
  localStorage.removeItem('myToken');             // destroying myToken container
  res.send('Logout Success');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});







module.exports = router;
