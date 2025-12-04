const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv= require ('dotenv');
const connectDb = require('./config/dbConnect');


const authRoute = require('./routes/authRoute.js')
const chatRoute = require('./routes/chatRoute.js')
dotenv.config();

const port = process.env.PORT
const app = express();

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended :true}))

connectDb().then();


//Routes
app.use('/api/auth',authRoute)
app.use('/api/chat',chatRoute)


app.listen(port,()=>{
    console.log(`Server (app) is running on ${port}`);
})