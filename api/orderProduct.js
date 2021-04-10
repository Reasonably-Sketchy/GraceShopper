const express = require('express');
const orderProductRouter = express.Router();
const {requireUser, requiredNotSent} = require("./utils");
const jwt = require("jsonwebtoken");
const {
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    getCartByUser,
    client,
    getAllProducts
} = require('../db');
const productsRouter = require('./products');

orderProductRouter.get('/', async (req, res, next)=>{
    try { 
        const orders = await getAllOrders();
        
        res.send(orders)
    } catch ({name, message}) {
        next({name, message});
    } 
});



orderProductRouter.patch('/order_products/:orderProductId', 
    requireUser,
    requiredNotSent({requiredParams: ['price', 'quantity']}),
    async (req, res, next) => {
        try {
            const {price, quantity} = req.body
            const {orderProductId} = req.params;
            const orderProductUpdate = await getOrderProductById(orderProductId);
            if(!orderProductUpdate) {
                next({
                    name: 'NotFound',
                    message: `No order_product found by ID ${orderProductId}`
                })
            } else {
                const updatedOrderProduct = await updateOrderProduct({id: req.params.orderProductId, price, quantity})
                res.send(updatedOrderProduct)
            }

        } catch (error) {
            next(error)
        }
});

orderProductRouter.delete('/order_products/:orderProductId', requireUser, async(req, res, next)=>{
    try {
        const deleteRoutineActivity = await destroyOrderProduct(req.params.orderProductId)
        res.send({success: true, ...deleteRoutineActivity});
    } catch (error) {
        next(error)
    }
});

module.exports = orderProductRouter;