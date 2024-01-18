const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/user");
const {sendStripeKey , captureStripe , sendRazorPayKey , captureRazorPay} = require('../controllers/paymentController');

router.route('/stripekey').get(isLoggedIn , sendStripeKey);
router.route('/razorpaykey').get(isLoggedIn , sendRazorPayKey);

router.route('/capturestripe').post(isLoggedIn , captureStripe);
router.route('/capturerazorpay').post(isLoggedIn , captureRazorPay);

module.exports = router;
