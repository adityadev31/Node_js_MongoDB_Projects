var express = require('express');
var jwt = require('jsonwebtoken');
var studentModel = require('../models/student');
var adminModel = require('../models/admin');
var router = express.Router();



// nod-localStorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Choose' });
});





/*....................... S T U D E N T ........................*/





/*  Student Registeration  */
router.get('/studentregister', function(req, res, next) {
  res.render('studentregister', { title: 'Student Registeration', 'msg': '' });
});

router.post('/studentregister', function(req, res, next){
  var modelChecker1 = studentModel.findOne({email: req.body.studentEmail});
  modelChecker1.exec(function(err, data){
    if(err) throw err;
    else{
      if(data){     // if any user with same email exists
        res.render('studentregister', { title: 'Student Registeration', 'msg':'Email already registered' });
      }
      else{         // new email
        var newStud = new studentModel({
          name: req.body.studentName,
          class: req.body.studentClass,
          email: req.body.studentEmail,
          password: req.body.studentPassword
        });
        console.log(newStud);
        newStud.save();
        res.render('studentregister', { title: 'Student Registeration', 'msg':'Student registered successfully.. go to login page' });
      }
    }
  });
});







/*  Student Login  */
router.get('/studentlogin', function(req, res, next) {
  res.render('studentlogin', { title: 'Student Login', 'msg': '' });
});

router.post('/studentlogin', function(req, res, next){
  var modelChecker2 = studentModel.findOne({email: req.body.studentEmail});
  modelChecker2.exec(function(err, data){
    if(err) throw err;
    else{
      if(data){  // if data (user) exists
        if(data.password == req.body.studentPassword){    // that user(in DB) pass = input pass
          // creating login tokens
          var token = jwt.sign({ foo: 'bar' }, 'loginToken'); // making token for login  and naming  it 'loginToken'
          localStorage.setItem('myToken', token); // making a local storage named 'myToken' and inserting token (loginToken) in it
          res.render('studentDashBoard', { title: 'Student Dashboard', 'name': data.name, records: data });
        }
        else{ // password not mach DB
          res.render('studentlogin', { title: 'Student Login', 'msg': 'Password incorrect' });
        }
      }
      else{
        res.render('studentlogin', { title: 'Student Login', 'msg': 'Email not registered' });
      }
    }
  });
});



/* middleware */
function checkSignIn(req, res, next){
  var myToken = localStorage.getItem('myToken');
  try {
    jwt.verify(myToken, 'loginToken'); // checking whether the box - myToken contains loginToken or not
  } catch(err) {
    res.render('studentlogin', { title: 'Student Login', 'msg': 'Login first !' });
  }
  next();
}


/*  Student Dashboard  */
router.get('/studentDashBoard', checkSignIn,  function(req, res, next) {
  res.render('studentDashBoard', { title: 'Student Dashboard', 'name': '', records: data });
});



/*  Student Logout  */
router.get('/studentlogout', function(req, res, next) {
  localStorage.removeItem('myToken');
  res.render('studentlogin', { title: 'Student Login', 'msg': 'logout successfully'});
});



/* Student Edit */
router.get('/studentEdit/:id', checkSignIn, function(req, res, next){
  var editStudentID = req.params.id;
  var modelChecker3 = studentModel.findById(editStudentID);
  modelChecker3.exec(function(err, data){
    if(err) throw err;
    else{
      res.render('studentEdit', { title: data.name, records: data });
    }
  });
});

router.post('/edittingStudent/:id', checkSignIn, function(req, res, next){
  var editStudentID = req.params.id;
  var modelChecker5 = studentModel.findByIdAndUpdate(editStudentID, {
    name: req.body.studentName,
    class: req.body.studentClass,
    email: req.body.studentEmail,
    password: req.body.studentPassword,
  }, {new: true});                            // {new: true}   updates data live
  modelChecker5.exec(function(err, data1){
    if(err) throw err;
    else{
      res.render('studentDashBoard', { title: 'Student Dashboard', 'name': data1.name, records: data1 });
    }
  });
});




/* cancel */
router.get('/editCancel/:id', checkSignIn, function(req,res,next){
  var modelChecker4 = studentModel.findById(req.params.id);
  modelChecker4.exec(function(err, data){
    if(err) throw err;
    res.render('studentDashBoard', { title: 'Student Dashboard', 'name': data.name, records: data });
  });
});



/* Student Delete */
router.get('/studentDelete/:id', checkSignIn, function(req, res, next){
  var modelChecker6 = studentModel.findByIdAndDelete(req.params.id);
  modelChecker6.exec(function(err, data){
    if(err) throw err;
    else{
      res.redirect('/studentlogout');
    }
  });
});













/* ............................... A D M I N ................................ */






/*  Admin Registeration  */
router.get('/adminregister', function(req, res, next) {
  res.render('adminregister', { title: 'Admin Registeration', 'msg': '' });
});

router.post('/adminregister', function(req, res, next){
  var modelChecker7 = adminModel.findOne({email: req.body.adminEmail});
  modelChecker7.exec(function(err, data){
    if(err) throw err;
    else{
      if(data){     // if any user with same email exists
        res.render('adminregister', { title: 'Admin Registeration', 'msg':'Email already registered' });
      }
      else{         // new email
        var newAdmin = new adminModel({
          name: req.body.adminName,
          email: req.body.adminEmail,
          password: req.body.adminPassword
        });
        console.log(newAdmin);
        newAdmin.save();
        res.render('adminlogin', { title: 'Admin Login', 'msg': 'New admin registered successfully !' });
      }
    }
  });
});








/*  Admin Login  */
router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin', { title: 'Admin Login', 'msg': '' });
});

router.post('/adminlogin', function(req, res, next){
  var modelChecker8 = adminModel.findOne({email: req.body.adminEmail});
  modelChecker8.exec(function(err, data){
    if(err) throw err;
    else{
      if(data){  // if data (user) exists
        if(data.password == req.body.adminPassword){    // that user(in DB) pass = input pass
          // creating login tokens
          var admintoken = jwt.sign({ foo: 'bar' }, 'adminloginToken'); // making token for login  and naming  it 'loginToken'
          localStorage.setItem('myAdminToken', admintoken); // making a local storage named 'myToken' and inserting token (loginToken) in it
          // getting students records
          var modelChecker9 = studentModel.find({});
          modelChecker9.exec(function(err, studData){
            if(err) throw err;
            else{
              res.render('adminDashBoard', { title: 'Admin Dashboard', 'records': data, 'sData': studData });
            }
          });
        }
        else{ // password not mach DB
          res.render('adminlogin', { title: 'Admin Login', 'msg': 'Password incorrect' });
        }
      }
      else{
        res.render('adminlogin', { title: 'Admin Login', 'msg': 'Email not registered' });
      }
    }
  });
});



/* middleware */
function checkSignInAdmin(req, res, next){
  var myAdminToken = localStorage.getItem('myAdminToken');
  try {
    jwt.verify(myAdminToken, 'adminloginToken'); // checking whether the box - myToken contains loginToken or not
  } catch(err) {
    res.render('adminlogin', { title: 'Admin Login', 'msg': 'Login first !' });
  }
  next();
}





/*  Admin Logout  */
router.get('/adminlogout', checkSignInAdmin, function(req, res, next) {
  localStorage.removeItem('myAdminToken');
  res.render('adminlogin', { title: 'Admin Login', 'msg': 'logout successfully'});
});




module.exports = router;
