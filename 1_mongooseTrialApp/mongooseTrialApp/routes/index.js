var express = require('express');
var empModel = require('../mongoose_Models/mongooseEmployee');  // connect with our model directory
var router = express.Router();
var employeeVar = empModel.find({});       // employee will contain all the data of the collection

/* GET home page. */
router.get('/', function(req, res, next) {
  employeeVar.exec(function(err,data){
    if(err) throw err;
    res.render('index', { title: 'Employee Records', records:data });
  });
});

module.exports = router;
