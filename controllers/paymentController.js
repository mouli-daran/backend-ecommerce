const BigPromise = require('../middlewares/bigPromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.sendStripeKey = BigPromise(async (req , res , next) => {
    res.status(200).json({
        stripekey: process.env.STRIPE_PUBLIC_KEY
    })
})

exports.captureStripe = BigPromise(async (req , res , next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',

        metadata: {integration_check: 'accept_a_payment'}
      });
})

exports.sendRazorPayKey = BigPromise(async (req , res , next) => {
    res.status(200).json({
        stripekey: process.env.RAZORPAY_KEY_ID
    })
});

exports.captureRazorPay = BigPromise(async (req , res , next) => {
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET_KEY })

    const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "receipt#1",
      }
const myOrders = instance.orders.create(options);

res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrders
})
});
