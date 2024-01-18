const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//Regular middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



//temp file upload cloudinary
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//Morgan import
app.use(morgan("tiny"))

//Routes import 
const home = require('./routes/home')
const user = require('./routes/user')
const product = require('./routes/product')
const payment = require('./routes/payments')
const order = require('./routes/order')

 

//Router middleware
app.use('/api/v1/' , home)
app.use('/api/v1/' , user)
app.use('/api/v1/' , product)
app.use('/api/v1/' , payment)
app.use('/api/v1/' , order)






module.exports = app;