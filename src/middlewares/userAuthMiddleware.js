const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;
        if (! token){
            throw new Error("Token is not valid.");
        }
        const decodedMessage = await jwt.verify(token, "Dev@Tinder123");
        const { _id } = decodedMessage;
        const user = await User.findOne({ _id: _id });
        if (!user) {
            throw new Error("User not found..");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).json("ERROR: "+err);
    }
};

module.exports = userAuth;