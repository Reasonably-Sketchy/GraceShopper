require('dotenv').config();
const { getAllProducts } = require ('../db');
const client = require('../db/client');
const { SERVER_ADDRESS = 'http://localhost:', PORT = 3000 } = process.env;
const API_URL = process.env.API_URL || SERVER_ADDRESS + PORT;
const axios = require('axios');
const { beforeAll, it, expect } = require('@jest/globals');

let productsFromDatabase;

describe('API', () => {
    describe('Products', () => {
        let products;
        describe('GET /api/products', () => {
            beforeAll(() => {
                const { data } = await axios.get(`${API_URL}/api/products`);
                products = data;
            });

            it('Returns an array', () => {
                expect(Array.isArray(products).toBe(true));
            });

            it('Returns products from the database', () => {
                const [ product ] = products;
                expect(product.name).toBeDefined();
            });

        })

        describe('GET /api/products/:productId', () => {
            beforeAll(() => {
                const { data } = await axios.get(`${API_URL}/api/products/1`);
                firstProduct = data;
            });

            it('Returns a product from the database', () => {
                expect(firstProduct.name).toBeDefined();
            });

            it('Returns the correct product', () => {
                expect(firstProduct.id).toEqual(1);
            });
        })
    })
})