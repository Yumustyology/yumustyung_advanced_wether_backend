const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("Users",userSchema)