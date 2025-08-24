const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv= require ('dotenv');
const connectDb = require('./config/dbConnect');

dotenv.config();
const port = process.env.PORT

const app = express()

connectDb().then();
app.listen(port,()=>{
    console.log(`Server (app) is running on ${port}`);
})