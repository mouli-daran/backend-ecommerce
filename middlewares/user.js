const user = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = BigPromise(async(req , res , next) => {
    let token = req.cookies.token;

    // if token not found in cookies, check if header contains Auth field
    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if(!token) {
        return next(new CustomError("Token is not present", 400));
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id);
    next();
})

exports.customRole = (...roles) => {
    return (req , res , next) => {
        if(!roles.includes(req.user.role)) {
            return next(new CustomError("You are not authorized to access", 400));
        }
        next()
    }
}