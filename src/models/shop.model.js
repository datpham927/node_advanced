
"use strict"
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const shopSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
module.exports = mongoose.model('Shop', shopSchema);