const axios = require('axios');
require('dotenv').config();
const { getAllProducts } = require ('../db');
const { rebuildDB } = require('../db/seedData');
const client = require('../db/client');

const { SERVER_ADDRESS = 'http://localhost:', PORT = 3000 } = process.env;
const API_URL = process.env.API_URL || SERVER_ADDRESS + PORT;

describe('API', () => {

    beforeAll(async() => {
        await rebuildDB();
      })
      afterAll(async() => {
        await client.end();
      })
      it('responds to a request at /api/health with a message specifying it is healthy', async () => {
        try {
            const res = await axios.get(`${API_URL}/api/health`);
            expect(typeof res.data.message).toEqual('string');
    
        } catch(error) {
            console.error('Line 19', error)
        }
      });

    describe('Products', () => {
        let products;
        describe('GET /api/products', () => {
            beforeAll(async () => {
                try {
                    const { data } = await axios.get(`${API_URL}/api/products`);
                    products = data;
                } catch(error) {
                    console.error('Error on 31:', error)
                }

            });

            it('Returns an array', () => {
                expect(Array.isArray(products)).toBe(true);
            });

            it('Returns products from the database', () => {
                const [ product ] = products;
                expect(product.name).toBeDefined();
            });

        })

        describe('GET /api/products/:productId', () => {
            let firstProduct;
            beforeAll(async () => {
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