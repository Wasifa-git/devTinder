const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(data) {
            if( ! validator.isEmail(data)) {
                throw new Error("Email is invalid");
            }
        }
    },
    gender:{
        type:String,
        validate(data) {
            if(!["male","female","others"].includes(data)) {
                throw new Error("not a valid type");
            }
        }
    },
    age:{
        type:Number,
        min:6,
        max:12
    },
    password:{
        type:String,
        required:true,
        validate(data) {
            if( ! validator.isStrongPassword(data)) {
                throw new Error("Password is not strong enough");
            }
        }
    },
    photoURL:{
        type:String,
        default:"https://t3.ftcdn.net/jpg/05/79/55/26/360_F_579552668_sZD51Sjmi89GhGqyF27pZcrqyi7cEYBH.jpg",
        validate(data) {
            if( ! validator.isURL(data)) {
                throw new Error("Password is not strong enough");
            }
        }
    },
    about:{
        type:String,
        default:"I m who I m"
    },
    skills:{
        type:[String]
    }
},{timestamps:true});
module.exports=mongoose.model("User",userSchema);