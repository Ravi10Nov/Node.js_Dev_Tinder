const userAuth = (req,res,next)=>{
    const token = 'xyz';
    const isAuthorised = token === 'xyz';
    if (! isAuthorised){
        res.send('User is not authorised !!')
    }else{
        next();
    }
};

module.exports = userAuth;