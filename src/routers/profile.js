const express = require("express");

const profileRouter = express.Router();

const userAuth = require('../middlewares/userAuthMiddleware');

const {validateEditProfileData} = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

profileRouter.patch("/profile/edit" ,userAuth , async (req,res)=>{
    try{
        if (! validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key] ));

        await loggedInUser.save();
        res.status(200).json({message:`${loggedInUser.firstName} , Your profile updated successfully...`,user:loggedInUser});

    }catch(err){
        res.status(400).json("Error: "+err.message);
    };

});

module.exports = profileRouter;

