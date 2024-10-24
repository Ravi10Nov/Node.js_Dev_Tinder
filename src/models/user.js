const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type: String
    },
    emailId : {
        type : String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error("Invalid email id"+ value);
            };
        }
    },
    password : {
        type : String,
        required:true
    },
    age : {
        type : Number,
        min:18
    },
    gender : {
        type : String,
        validate(value){
            if (!['male','female','other'].includes(value)){
                throw new Error("Gender not valid.");
            };
        }
    },
    photoUrl : {
        type : String,
        default : "https://avatars.githubusercontent.com/u/7790161?v=4"
    },
    about : {
        type : String,
        default : "This is a default about of the user"
    },
    skills : {
        type : [String]
    }
},{timestamps:true});   

userSchema.index({firstName:1 , lastName:1});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123",{expiresIn:'7d'});
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash );

    return isPasswordValid;

}

module.exports = mongoose.model("User" , userSchema);;