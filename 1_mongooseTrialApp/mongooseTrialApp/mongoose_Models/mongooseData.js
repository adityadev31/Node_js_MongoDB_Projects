// connecting schema
var mongoose = require('mongoose');


// creating schema
var kittySchema = new mongoose.Schema({
    name: String,
    class : String,
    roll: Number
});

// creating methods (functions)
kittySchema.methods.speak = function(){
    var greeting = this.name? "Meow name is " + this.name : "I dont have a name";
    console.log(greeting);
}

// creating model
var kitten = mongoose.model('kitten', kittySchema);


// our 1st kitten
var fluffy = new kitten({    // every data in json format
    name: 'fluffy',
    class: 'XI',
    roll: 16
});
console.log(fluffy);
fluffy.speak();


// 2nd kitten
var cat2 = new kitten({
    class: 'X',
    roll: 10
});
console.log(cat2);
cat2.speak();