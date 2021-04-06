const client = require('./client');
const { getUserById } = require('./users');

async function getOrderById(id){
    try {
        const {rows: [order]} = await client.query(`
            SELECT * 
            FROM orders
            WHERE id=$1
        `, [id])
 
        return order;
    } catch (error) {
        throw error
    }
}

async function getAllOrders(){
    try {
        const {rows} = await client.query(`
        SELECT *
        FROM products;
        `)
    } catch (error) {
        throw error
    }
}

async function getOrdersByUser({id}){
    try {
        const {rows: orders} = await client.query(`
            SELECT orders.*, users.id AS "creatorName"
            FROM orders
            JOIN users ON orders."userId" = users.id
            WHERE "creatorId" = $1
        `, [id]);
        return orders;

    } catch (error) {
        throw error;
    }
}

async function getOrdersByProduct({id}) {
    try {
        const {rows: orders} = await client.query(`
            SELECT *
            FROM orders
            JOIN order_products ON order_products."orderId" = orders.id
            WHERE order_products."productId" = $1;
        `, [id])
    } catch (error) {
        throw error
    }
}

async function getCartByUser({id}){
    try {
        const {rows: orders} = await client.query(`
            SELECT orders.*, users.id AS "creatorName"
            FROM orders
            JOIN users ON orders."userId" = users.id
            WHERE "creatorId" = $1
            AND 'created' = true
        `, [id])
        return orders
    } catch (error) {
        throw error
    }
}

async function createOrder({status, userId}){
    try {
        const {rows: [order]} = await client.query(`
            INSERT INTO orders (status, "userId")
            VALUES($1, $2)
            RETURNING *;
        `, [status, userId]);

        return order
    } catch (error) {
        throw error
    }
}

module.exports = {
    getOrderById,
    getAllOrders,
    getOrdersByUser,
    getOrdersByProduct,
    getCartByUser,
    createOrder
}