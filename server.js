const express = require('express');

const connectDB = require('./src/config/database');

const app = express();

const cookieParser = require('cookie-parser');

const authRouter = require("./src/routers/auth");
const profileRouter = require("./src/routers/profile");
const requestRouter = require("./src/routers/request");
const userRouter = require("./src/routers/user");

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
    .then(() => {
        console.log('Database connection established...');
        app.listen(6000, () => {
            console.log('App is running on port at 6000');
        });
    })
    .catch((err) => {
        console.error('Database can not be connected')
    });



