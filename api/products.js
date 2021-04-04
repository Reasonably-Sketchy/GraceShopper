const express = require('express');
const { getAllProducts, getProductById } = require('../db');
const productsRouter = express.Router();

productsRouter.use((req, res, next) => {
    console.log('A request is being made to /products...');
    next();
});

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch({ name, message }) {
        next({ name, message });
    };
});

productsRouter.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {
        const product = await getProductById(productId);

        if(!product) {
            throw Error('That product does not exist');
        };

        res.send(product);

    } catch({ name, message }) {
        next({ name, message });
    };
});

module.exports = productsRouter;