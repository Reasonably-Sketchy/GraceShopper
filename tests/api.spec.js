const axios = require('axios');
require('dotenv').config();
const { getAllProducts, getProductById, addProductToOrder } = require ('../db');
const { rebuildDB } = require('../db/seedData');
const client = require('../db/client');
// const { describe } = require('yargs');
// const { token } = require('morgan');
const { createOrder, getOrdersByProduct, getOrderById } = require('../db/orders');

const { SERVER_ADDRESS = 'http://localhost:', PORT = 3000 } = process.env;
const API_URL = process.env.API_URL || SERVER_ADDRESS + PORT;

describe('API', ()=> {
    beforeAll(async() => {
        await rebuildDB();
    });

    afterAll(() => {
        client.end();
    });

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
    }); // END describe('Products')

    describe('Users', () => {
        describe('POST /users/login', () => {
            it('Logs an existing user in', async () => {
                const {data} = await axios.post(`${API_URL}/api/users/login`, {username: 'albert', password: 'bertie99'});
                const token = data.token;
                expect(token).toBeDefined();
            });
        });

        describe('POST /users/register', () => {
            it('Registers a new user', async () => {
                const {data} = await axios.post(`${API_URL}/api/users/register`, {
                    first: 'tony',
                    last: 'tiger',
                    email: 'tonyrules@aol.com',
                    username: 'tony', 
                    password: 'tonyDaMan'
                });
                const token = data.token;
                expect(token).toBeDefined();
            });
        })
    });

    describe('Orders', () => {
        let token;
        beforeAll(async() => {
            try {
                const {data} = await axios.post(`${API_URL}/api/users/login`, {username: 'albert', password: 'bertie99'});
                token = data.token;
            } catch(error) {
                console.error(error);
            };
        });

        describe('POST /orders', () => {
            it('Creates a new order', async () => {
                const {data: response} = await axios.post(`${API_URL}/api/orders/`, {status: 'created'}, {headers: {'Authorization': `Bearer ${token}`}});                
                const {rows: [order] } = await client.query(`
                    SELECT *
                    FROM orders
                    WHERE id=$1;
                `, [response.id]);
                expect(order).toBeDefined();
            });
        })

        describe('POST /orders/:orderId/products', ()=>{
            let newOrder;
            let productToAdd;
            let newOrderProduct;
            it('Adds a product to an order', async()=>{
                newOrder = await createOrder({userId: 1, status: 'created'});
                productToAdd = await getProductById(1);
                newOrderProduct = {orderId: newOrder.id, productId: productToAdd.id, price: productToAdd.price, quantity: 2};
                const {data: response} = await axios.post(`${API_URL}/api/orders/${newOrder.id}/products`, {orderId: newOrder.id, ...newOrderProduct}, {headers: {'Authorization': `Bearer ${token}`}});                
                expect(response.orderId).toBe(newOrder.orderId);
            });
        });

        describe('PATCH /orders/:orderId', () => {
            it('Edits the status of an order', async()=>{
                newOrder = await createOrder({userId: 2, status: 'created'});
                orderToEdit = await getOrderById(newOrder.id);
                editedOrder = {orderId: newOrder.id, status: 'completed', userId: 2};
                const {data: response} = await axios.patch(`${API_URL}/api/orders/${newOrder.id}/`, {orderId: newOrder.id, ...editedOrder}, {headers: {'Authorization': `Bearer ${token}`}});                
                expect(response.status).toBe(editedOrder.status);
            });
        })

    })

    describe('Order_Products', ()=>{
        let token;
        let user;
        beforeAll(async() => {
            try {
                const {data} = await axios.post(`${API_URL}/api/users/login`, {username: 'albert', password: 'bertie99'});
                user = data.user;
                token = data.token;
            } catch(error) {
                console.error(error);
            };
        });

        describe('PATCH /order_products/:orderProductId', ()=>{
            it('updates the order product', async ()=>{
                const newOrder = await createOrder({userId: user.id, status: 'created'});
                const productToAdd = await getProductById(1);
                const orderProduct = await addProductToOrder({orderId: newOrder.id, productId: productToAdd.id, price: productToAdd.price, quantity: 5})
                const update = {
                    price: productToAdd.price,
                    quantity: 10,
                };
                const {data: response} = await axios.patch(`${API_URL}/api/order_products/${orderProduct.id}`, {...update}, {headers: {'Authorization': `Bearer ${token}`}});                
                expect(response.quantity).toEqual(update.quantity)
            })
        });

        describe('DELETE /order_products/:orderProductId', ()=>{
            it('removes product from order', async ()=>{
                const newOrder = await createOrder({userId: user.id, status: 'created'});
                const productToAdd = await getProductById(1);
                const orderProduct = await addProductToOrder({orderId: newOrder.id, productId: productToAdd.id, price: productToAdd.price, quantity: 5})
                const {data: response} = await axios.delete(`${API_URL}/api/order_products/${orderProduct.id}`, {headers: {'Authorization': `Bearer ${token}`}});                               
                expect(response.id).toBe(orderProduct.id);
            })
        } )
    }) // END describe('Order_Products')

    describe('Reviews', () => {
        let token;
        let user;
        let reviewToUpdateAndDelete;
        beforeAll(async() => {
            try {
                const {data} = await axios.post(`${API_URL}/api/users/login`, {username: 'albert', password: 'bertie99'});
                user = data.user;
                token = data.token;
            } catch(error) {
                console.error(error);
            };
        });

        describe('POST /reviews/:productId', () => {
            it('creates a new product review', async () => {
                const newReview = {
                        title: `SUPER RAD.`,
                        content: `THESE ARE RAD YO.`,
                        stars: 5,
                };
                const {data: response} = await axios.post(`${API_URL}/api/reviews/1`, {...newReview}, {headers: {'Authorization': `Bearer ${token}`}});                
                reviewToUpdateAndDelete = response;
                expect(response.title).toBe(newReview.title);
            });
        })

        describe('GET /reviews/:productId', () => {
            it('returns an array', async () => {
                const {data} = await axios.get(`${API_URL}/api/reviews/1`);
                expect(Array.isArray(data)).toBe(true);
            });
            
            it('returns reviews for the given product', async () => {
                const {data} = await axios.get(`${API_URL}/api/reviews/1`);
                expect(data[0].productId).toBe(1);
            });
        });

        describe('GET /users/:userId/reviews', () => {
            it('returns reviews made by the given user', async () => {
                const {data} = await axios.get(`${API_URL}/api/users/2/reviews`, {headers: {'Authorization': `Bearer ${token}`}});
                expect(data[0].userId).toBe(2);
            });
        });

        describe('PATCH /reviews/:reviewId', () => {
            it('attempts to edit the correct review', async () => {
                const updatedReview = {
                    title: `SUPER DUPER RAD.`,
                    content: `THESE ARE TOTALLY RAD YO.`,
                    stars: 4,
                };
                const {data: response} = await axios.patch(`${API_URL}/api/reviews/${reviewToUpdateAndDelete.id}/`, {...updatedReview}, {headers: {'Authorization': `Bearer ${token}`}});
                expect(response.id).toBe(reviewToUpdateAndDelete.id);
            });

            it('edits the review', async () => {
                const updatedReview = {
                    title: `SUPER DUPER RAD.`,
                    content: `THESE ARE TOTALLY RAD YO.`,
                    stars: 4,
                };
                const {data: response} = await axios.patch(`${API_URL}/api/reviews/${reviewToUpdateAndDelete.id}/`, {...updatedReview}, {headers: {'Authorization': `Bearer ${token}`}});                
                expect(response.title).toBe(updatedReview.title);
            })
        });

        describe('DELETE /reviews/:reviewId', () => {
            it('deletes the correct review', async () => {
                const {data: response} = await axios.delete(`${API_URL}/api/reviews/${reviewToUpdateAndDelete.id}/`, {headers: {'Authorization': `Bearer ${token}`}});
                expect(response.id).toBe(reviewToUpdateAndDelete.id);
            });
        })

    })
}); // END describe('API')