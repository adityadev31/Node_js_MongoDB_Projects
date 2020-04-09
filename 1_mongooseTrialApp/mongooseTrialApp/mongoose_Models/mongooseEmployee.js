// connecting schema
var mongoose = require('mongoose');

// connecting to local database
mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true});

// creating connection object 'db'
var db = mongoose.connection;


//......................................................................................................

// creating schema
var employeeSchema = new mongoose.Schema({      // in json format
    name: String,
    email: String,
    hourlyRate: Number,
    totalHour: Number,
    total: Number,
});

// creating method to find total salary(before creating model)
employeeSchema.methods.totalSalary=function(){ return this.hourlyRate * this.totalHour; }

// creating model
var employeeModel = mongoose.model('EmployeeData', employeeSchema);   // var x = mongoose.model('modelName', 'SchemaName')


// creating objects (new employees)
var employees = new employeeModel({     // entry in json format
    name: "Naresh",
    email: "Naresh@gmail.com",
    hourlyRate: 200,
    totalHour: 2,
});
employees.total = employees.totalSalary();       // for calling methods object.methodeName()



//......................................................................................................



// if connected
db.on("connected", function(){
    console.log("DB Connected Successfully !");
});

// if disconnected
db.on("disconnected", function(){
    console.log("DB Disconnected !");
});

// if some error occured
db.on('error', console.error.bind(console, 'connection error:'));

// opening database
db.once('open', function(){
    employees.save(function (err, res) {
        if (err) return console.error(err);
        console.log(res);
        db.close();
    });
});

module.exports = employeeModel;