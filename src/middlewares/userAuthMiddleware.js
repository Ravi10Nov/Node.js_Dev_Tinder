const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        console.log("Cookies received -28:", cookie);  // Log cookies
        
        const { token } = cookie;
        if (!token) {
            return res.status(401).send("Please login");
        }

        const decodedMessage = await jwt.verify(token, process.env.jwt_secret);
        console.log("Decoded token: -36 ", decodedMessage);  // Log decoded token

        const { _id } = decodedMessage;
        const user = await User.findOne({ _id: _id });
        if (!user) {
            throw new Error("User not found.");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication error: 47", err);  // Log error details
        res.status(400).json("ERROR: " + err.message);
    }
};


module.exports = userAuth;