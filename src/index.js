const express = require('express');
const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const http = require('http')


dotenv.config()



//define the port else it will use port 3000 by default
const PORT = process.env.PORT || 3000

// const ssl_certificate = fs.readFileSync('./server.cert','utf-8')
// const ssl_key = fs.readFileSync('./server.key','utf-8')
// const credentials = {key: ssl_key,cert:ssl_certificate}

//connect to MongoDB database using Mongoose ORM
console.log(process.env.MONGOURI)
mongoose.connect(process.env.MONGOURI)
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=> console.error(err))


const httpserver = http.createServer(app)
//start listening on that specific port
httpserver.listen(PORT,()=>{
    console.log('server is started on the  port ' + PORT)   
})