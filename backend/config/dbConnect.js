const mongoose = require ('mongoose')


const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Server is connected to database succesfully");
    }
    catch(e)
    {
        console.log("error in connecting");
        console.log(e.message);
        process.exit(1);
    }
}

module.exports = connectDb;
