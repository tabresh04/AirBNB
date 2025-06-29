const mongoose = require('mongoose');

const databaseconn = async () => {
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/homee');
        console.log("Mongoose Connected Successfully ");
        return conn;
    }
    catch(err){
        console.log("Errors in connecting database ", err);
    }
}

module.exports = databaseconn;