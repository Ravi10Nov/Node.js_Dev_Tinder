const express = require('express');

const connectDB = require('./src/config/database');

const app = express();

const User = require('./src/models/user');

const bcrypt = require("bcrypt");

const isValidateSignupData = require("./utils/validate");
const { default: mongoose } = require('mongoose');

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        isValidateSignupData(req);
        const {firstName ,lastName ,emailId ,password} = req.body;
        const passwordHash = await bcrypt.hash(password ,10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })
        await user.save();
        res.status(200).send('User added successfully.');
    } catch (err){
        res.status(400).send(err.message)
    }
})

app.post("/login", async (req,res)=>{

    const {emailId , password} = req.body;

    try{

        const user = await User.findOne({emailId:emailId});
        if (! user){
            throw new Error("Invalid email id.")
        }
        else{
            const isValidPassword = await bcrypt.compare(password , user.password);
            if(!isValidPassword){
                throw new Error("Password is not valid!!");
            }else{
                res.status(200).json("Login successfully....");
            }
        };
    }
    catch(err){
        res.status(400).json(err.message);
    }


})

app.get('/user', async (req, res) => {

    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({ emailId: userEmail });
        if (user.length === 0) {
            res.status(400).json('User not found.');
        } else {
            res.status(200).send(user);
        }
    } catch (err) {
        res.status(400).json('Something wnet wrong.');
    };
});

app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        if (users.length <= 0) {
            res.status(404).json("USER NOT FOUND");
        } else {
            res.status(200).json(users)
        }
    } catch (err) {
        res.status(400).json('Something wnet wrong.');
    }
})

app.delete("/deleteUser", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send('User deleted sucessfully');
    } catch (err) {
        res.status(400).json('Something wnet wrong.');
    }
})

app.patch('/update/:userId', async (req, res) => {
    const userId = req.params?.userId;
    console.log(userId)
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ['userid', 'photoUrl', 'skills', 'gender', 'age', 'about'];
        const isValidateData = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isValidateData) {
            throw new Error('Update not allowed.')
        }
        if (data.skills.length > 10) {
            throw new Error('Can not add more than 10 skills');
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: 'after', runValidators: true });
        res.status(200).json("User updated successfully.")
    } catch (err) {
        res.status(400).json('Update failed' + err.message);
    }
})

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



