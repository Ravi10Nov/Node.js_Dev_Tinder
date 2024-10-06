const express = require('express');

const app = express();

const userAuth = require('./middlewares/userAuthMiddleware');

app.use('/user',userAuth);

app.use('/user/getAllData',(req,res,next)=>{
    res.send('All Data.');
});

app.get('/user/deleteUser',(req,res)=>{
    res.send('Delete user.')
})

app.get('/xyz',(req,res)=>{
    res.send('Hi')
})

app.listen(6000,()=>{
    console.log('App is running on port at 6000');
});