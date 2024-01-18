const BigPromise = require('../middlewares/bigPromise')

exports.home = BigPromise(async (req , res) => {
    res.status(200).json({
        success: true, 
        greetings: "Hello from api"
    })
})


exports.homeDummy = BigPromise(async (req , res) => {
    res.status(200).json({
        success: true, 
        greetings: "Hello from dummy api"
    })
})