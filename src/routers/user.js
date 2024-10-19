const express = require("express");
const userAuth = require("../middlewares/userAuthMiddleware");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate(
            "fromUserId",["firstName", "lastName","photoUrl", "age", "gender", "about" ,"skills"]
        )
        res.status(200).json(connectionRequest)
    }catch(err){
        res.status(400).json("Error: " +err.message)
    }
});

userRouter.get("/user/connections",userAuth , async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser , status:"accepted"},
                {toUserId:loggedInUser , status:"accepted"}
            ]
        }).populate("fromUserId",["firstName", "lastName","photoUrl", "age", "gender", "about" ,"skills"])
        .populate("toUserId",["firstName", "lastName","photoUrl", "age", "gender", "about" ,"skills"]);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        })

        res.status(200).json({data});

    }catch(err){
        res.status(400).json("Error: "+err.message);
    }
})

userRouter.get("/user/connection/feed",userAuth,async (req,res)=>{
    try{

        const loggedInUser = req.user;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id:{$nin :Array.from(hideUsersFromFeed)}},
                {_id :{$ne : loggedInUser._id}}
            ]
        }).select(["firstName", "lastName","photoUrl", "age", "gender", "about" ,"skills"]).skip(skip).limit(limit);
        
        res.status(200).json(users);

    }catch(err){
        res.status(400).json("Error: "+err.message);
    }
})

module.exports = userRouter;
