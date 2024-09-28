const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Session = require('express-session')
require('dotenv').config()

//set a middleware to redirect on new configuration
/* app.use((req,res,next)=>{
    if (rate.isExceeded) {
        
    }
    //we need to get a way to know if there is a new configuration
}) */

app.use(Session({
    resave:false,
    secret:"mySecr",
    saveUninitialized:false //store in .env
}))

app.use(express.json())

app.set('view engine','ejs')
app.set('trust proxy', true)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


module.exports = app