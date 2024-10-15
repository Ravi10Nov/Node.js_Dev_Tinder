
const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://ravikantaskant81:Ravi7433@devtinder.xxmy3.mongodb.net/devTinder"
    )
};

module.exports = connectDB;