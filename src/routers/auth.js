const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {isValidateSignupData} = require("../utils/validate");

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
        res.status(200).send('User added successfully.');
    } catch (err) {
        res.status(400).send(err.message)
    }
});

authRouter.post("/login", async (req, res) => {

    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid email id.")
        }
        else {
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                throw new Error("Password is not valid!!");
            } else {
                const token = await user.getJWT();
                res.cookie("token", token);
                res.status(200).json("Login successfully....");
            }
        };
    }
    catch (err) {
        res.status(400).json(err.message);
    };
});

authRouter.post("/logout",async (req,res)=>{
    res.
    cookie("token",null ,{expire : new Date(Date.now())})
    .send(`loggedout successfully`);
});

module.exports = authRouter;