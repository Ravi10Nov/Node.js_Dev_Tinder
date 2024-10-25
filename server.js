const dotenv = require("dotenv");
dotenv.config();

const express = require('express');

const connectDB = require('./src/config/database');

const app = express();

const cookieParser = require('cookie-parser');

const cors = require("cors");


const authRouter = require("./src/routers/auth");
const profileRouter = require("./src/routers/profile");
const requestRouter = require("./src/routers/request");
const userRouter = require("./src/routers/user");

const port = process.env.PORT || 4500;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://dev-tinder-app.vercel.app",
    // origin:"http://localhost:5173",
    credentials:true,
    "Access-Control-Allow-Origin": "*"
}))

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
    .then(() => {
        console.log('Database connection established...');
        app.listen(port, () => {
            console.log(`App is running on port at ${port}`);
        });
    })
    .catch((err) => {
        console.error('Database can not be connected')
    });



