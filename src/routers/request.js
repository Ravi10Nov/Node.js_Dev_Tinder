const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:userId",userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ['interested','ignored'];
        if (! allowedStatus.includes(status)){
            return res.status(400).json(`${status} is invalid status.`);
        }

        const toUser = await User.findById(toUserId);

        if (! toUser){
            return res.status(404).json({message:"User not found!!!"});
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId ,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        });

        if (existingConnectionRequest){
            return res.status(402).json("Connection already exist!!!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
        res.status(200).json(
            {
                message:`${req.user.firstName} is ${status} profile of ${toUser.firstName} `,
                data
            }
        )
    }catch(err){
        res.status(400).json("Error: "+err.message);
    };
})

requestRouter.post("/request/review/:status/:requestId",userAuth , async (req,res)=>{

    try{
        const loggedInUser = req.user;
        const {status ,requestId } = req.params;

        const AllowedStatus = ['accepted','rejected'];
        if (! AllowedStatus.includes(status)){
            return res.status(404).json({message:"Status is not valid."})
        }
        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if (! connectionRequest){
            throw new Error("Connection request not found.")
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({message:"Connection made successfully.",data:data});
    }catch(err){
        res.status(400).json("Error: "+err)
    }
    
})


module.exports = requestRouter;