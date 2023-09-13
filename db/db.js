const mongoose = require('mongoose');
const connectDB = async() => {
    try{
        await mongoose.connect('mongodb://localhost:27017/pg-disert');
        console.log('Connected to MongoDB');
    }
    catch(error){
        console.log(error);
    }
}

module.exports = connectDB;