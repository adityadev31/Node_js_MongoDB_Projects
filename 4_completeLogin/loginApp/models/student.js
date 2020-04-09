var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testLogin', {useNewUrlParser: true});
var db = mongoose.connection;

// schema
var studentSchema = new mongoose.Schema({
    name: String,
    class: String,
    email: String,
    password: String
});

// export
module.exports = mongoose.model('students', studentSchema);