var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testLogin', {useNewUrlParser: true});
var db = mongoose.connection;

// schema
var adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// export
module.exports = mongoose.model('admins', adminSchema);