

//imports for the app
const express = require('express')
const app = express();

const cors = require('cors')


const routes = require("./api/routes/mainroutes")

app.use(express.json())
app.use(cors())
app.use('/api/upload',routes) //protected route which uses the authetication middle ware and then passes the function to the routes
// app.use('/api/auth',authroutes)//auth routes which includes routes related to the register and the login purpose


//export the module to import in the index.js
module.exports=app;