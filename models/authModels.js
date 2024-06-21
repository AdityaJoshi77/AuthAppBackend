
// importing mongoose...
const mongoose = require('mongoose');

// defining schema...
const usedSchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        trim:true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        required: true,
        enum:["Admin","Student","Visitor"]
    }
})

module.exports = mongoose.model("Auth",usedSchema);