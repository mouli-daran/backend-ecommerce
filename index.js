const app = require('./app');
const connectWithDb = require('./config/db');
const cloudinary = require('cloudinary')
require('dotenv').config()

connectWithDb();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET 
})



app.listen(process.env.PORT , (req , res) => {
    console.log(`Server is running at ${process.env.PORT}`);
})