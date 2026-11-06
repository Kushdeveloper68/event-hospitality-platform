const mongoose = require("mongoose")
const Schema = mongoose.Schema

// email , name , password , organization name, term&conditions agree or not
const User = new Schema({
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
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiry:{
        type:Date,
        default:null
    },
    // First marketing touch that led to this signup (set once, never overwritten).
    // Missing on accounts created before tracking started.
    signupSource: {
        source: { type: String, default: null },
        medium: { type: String, default: null },
        campaign: { type: String, default: null },
        referrer: { type: String, default: null },
        landingPath: { type: String, default: null },
        capturedAt: { type: Date, default: null },
    },
    signupMethod: {
        type: String,
        enum: ["email", "google"],
        default: undefined,
    }
}, {timestamps:true})

// Admin dashboard groups signups by source
User.index({ "signupSource.source": 1 })

const UserModel = mongoose.model("User", User)

module.exports =  UserModel