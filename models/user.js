const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Name is Required"],
        maxLength: [40 , "Name should be minimum of 40 characters"]
    },
    email: {
        type: String,
        required: [true , "Email is required"],
        validate: [validator.isEmail , "Email is not in correct form"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password must be minimum 6 characters"],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
});

//encrypt password before save -hooks
userSchema.pre('save' , async function(next) {

    if(!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password , 10)
});

//compare and validate passed on user password
userSchema.methods.isValidatePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword , this.password)
};


//create and return jwt token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id} , process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
};

//generate forgot password token in string
userSchema.methods.getForgotPasswordToken = function () {
    const forgotToken = crypto.randomBytes(20).toString('hex')

    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken
}


module.exports = mongoose.model("User" , userSchema);