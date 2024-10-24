const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {isValidateSignupData} = require("../utils/validate");
const userAuth = require("../middlewares/userAuthMiddleware");

authRouter.post('/signup', async (req, res) => {
    try {
        isValidateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await user.save();
        res.status(200).send({message:'User added successfully.',data:user});
    } catch (err) {
        res.status(400).send(err.message)
    }
});

authRouter.post("/login", async (req, res) => {

    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid email id or password")
        }
        else {
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                throw new Error("Invalid email id or password");
            } else {
                const token = await user.getJWT();
                res.cookie("token", token);
                res.status(200).json({message:"Login successfully....",data:user});
            }
        };
    }
    catch (err) {
        res.status(400).json({message:err.message});
    };
});

authRouter.post("/logout",async (req,res)=>{
    res.
    cookie("token",null ,{expires : new Date(Date.now())});
    res.send(`loggedout successfully`);
});

authRouter.patch("/changePassword",userAuth ,async (req,res)=>{

    const loggedInUser = req.user;
    
    try{
        const {newPassword , confirmPassword}= req.body;
        if (newPassword !== confirmPassword){
            throw new Error("Password not match")
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save()
        res.status(200).json({message:"Password updated successfully",user:loggedInUser});

    }catch(err){
        res.status(400).json({message:err.message});
    }
})

module.exports = authRouter;