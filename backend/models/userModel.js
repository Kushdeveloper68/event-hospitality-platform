const mongoose = require("mongoose")
const Schema = mongoose.Schema

// email , name , password , organization name, term&conditions agree or not
const User = Schema({
    name:{
       type: String,
       required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    organizationName:{
        type:String,
        required:true,
    },
    termCondition:{
        type:Boolean,
        required:true,
        default:false
    }
}, {timestamps:true})

const UserModel = mongoose.model("User", User)

module.exports =  UserModel