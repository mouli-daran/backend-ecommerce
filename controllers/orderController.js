const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Order = require('../models/order')
const Product = require('../controllers/productController')

exports.createOrder = BigPromise(async(req , res , next) => {
    const {shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,} = req.body;

        const order = await Order.create({
            shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
        });

        res.status(200).json({
            success: true,
            order
        })
});

exports.getOneOrder = BigPromise(async(req , res , next) => {
   const order = await Order.findById(req.params.id).populate('user' , 'name email')
   
   if (!order) {
    return next(new CustomError("Please provide valid ID", 401));
   }

        res.status(200).json({
            success: true,
            order
        })
});

exports.getLoggedInOrders = BigPromise(async(req , res , next) => {
    const order = await Order.find({user: req.user._id})
    
    if (!order) {
     return next(new CustomError("Please provide valid ID", 401));
    }
 
         res.status(200).json({
             success: true,
             order
         })
 });

 exports.adminGetAllOrders = BigPromise(async(req , res , next) => {
    const orders = await Order.find();
    
    if (!orders) {
     return next(new CustomError("No orders found", 401));
    }
 
         res.status(200).json({
             success: true,
             orders
         })
 });

 exports.adminUpdateOneOrder = BigPromise(async(req , res , next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order.orderStatus === 'Delivered') {
        return next(new CustomError("Order is already marked as delivered", 401));
       }

       order.orderStatus = req.body.orderStatus;

       order.orderItems.forEach(async prod => {
        await updateProductStock(prod.produc , prod.quantity)
       });

       await order.save();

         res.status(200).json({
             success: true,
             order
         })
 });

 exports.adminDeleteOneOrder = BigPromise(async(req , res , next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new CustomError("Order is not proesent in the database", 401));
       }

       await order.remove();

         res.status(200).json({
             success: true,
         })
 });


 async function updateProductStock (productId , quantity) {
    const product = await Product.findById(productId);

    product.stock = product.stock - quantity

    await product.save({validateBeforeSave: false})
 }

