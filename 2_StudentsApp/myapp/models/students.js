// connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/students_db', {useNewUrlParser: true});
var conn = mongoose.connection;

// schema
var studentSchema = new mongoose.Schema({
    name: String,
    class: String,
    rollNo: Number,
    branchCode: String,
});

// creating model
var studentModel = mongoose.model('details', studentSchema);


// exporting model        **NOTE**  very important step
module.exports=studentModel;