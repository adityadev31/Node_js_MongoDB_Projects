var express = require('express');
var studentModel = require('../models/students');
var router = express.Router();




/*..............................................................................................*/


/* Index Page (Enter new student) */

router.get('/', function(req, res, next){
  res.render('index', { title: 'Enter Student Details'});
});

router.post('/', function(req, res, next){
  var studDetails = new studentModel({
    name: req.body.studName,
    class: req.body.studClass,
    rollNo: req.body.studRollNo,
    branchCode: req.body.studBranch,
  });

  console.log(studDetails);
  studDetails.save();

  res.render('index', { title: 'Enter Student Details' });
});


/*..............................................................................................*/






/*..............................................................................................*/

/* Search students */

router.get('/search/', function(req, res, next){
  var stud = studentModel.find({});     // to fetch data
  stud.exec(function(err, data){
    if(err) throw err;
    else{ res.render('showDetails', {title: 'Student Details', records: data}); }
  });
});

router.post('/search/', function(req, res, next){

  var fltrName = req.body.fltrName;
  var fltrClass = req.body.fltrClass;
  var fltrRollNo = req.body.fltrRollNo;

  if(fltrName!='' && fltrRollNo!='' && fltrClass!=''){
    var fltrParameter = {
      $or: [{name: fltrName}, {class: fltrClass}, {rollNo: fltrRollNo}]
    }
  }
  else if(fltrName=='' && fltrClass=='' && fltrRollNo==''){
    var fltrParameter = {}
  }
  else{
    var fltrParameter = {
      $or: [{name: fltrName}, {class: fltrClass}, {rollNo: fltrRollNo}]
    }
  }

  // to fetch data
  var studentFilter = studentModel.find(fltrParameter);

  studentFilter.exec(function(err, data){
    if(err) throw err;
    else{ res.render('showDetails', { title: 'Student Details', records: data });  }
  });
});







/*..............................................................................................*/




/*..............................................................................................*/



/* Show All Details*/

router.get('/showall/', function(req, res, next) {
  var student1 = studentModel.find({});             // to fetch data
  student1.exec(function(err, data){
    if(err) throw err;
    else{ 
      res.render('showDetails', { title: 'Student Details', records: data }); 
    }
  });
});




/*..............................................................................................*/












/*..............................................................................................*/



/* Delete Details */

router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  var del = studentModel.findByIdAndDelete(id);             // to delete according to id
  del.exec(function(err){
    if(err) throw err;
    else{ 
      res.redirect('/showall');
    }
  });
});


/*..............................................................................................*/






/*..............................................................................................*/



/* Edit Details */

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  var edit = studentModel.findById(id);             // to delete according to id
  edit.exec(function(err, data){
    if(err) throw err;
    else{ 
      res.render('edit', {title:'Edit Student Details', records: data});
    }
  });
});

router.post('/update/:id', function(req, res, next){
  var updater = studentModel.findByIdAndUpdate(req.params.id, {
    name: req.body.studName,
    class: req.body.studClass,
    rollNo: req.body.studRollNo,
    branchCode: req.body.studBranch,
  });
  updater.exec(function(err, data){
    if(err) throw err;
    else{
      res.redirect('/showall');
    }
  });
});


/*..............................................................................................*/




module.exports = router;
