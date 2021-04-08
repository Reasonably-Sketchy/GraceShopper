const client = require('./client');

const getOrderProductById = async (id) => {
    try {
        const {rows: [orderProduct]} = await client.query(`
            SELECT *
            FROM order_products
            WHERE id=$1;
        `, [id]);

        return orderProduct;
    } catch (error) {
        throw ('Error getting order product by Id: ', error);
    };
};

const addProductToOrder = async ({ orderId, productId, price, quantity }) => {
    try {
        // const {rows: [_orderProduct]} = await client.query(`
        //     SELECT *
        //     FROM order_products
        //     WHERE "orderId"=$1 AND "productId"=$2;
        // `, [orderId, productId]);

        // if (_orderProduct) {
        //     throw Error('That product is already on the order.');
        // };

        const {rows: [orderProduct]} = await client.query(`
            INSERT INTO order_products("productId", "orderId", price, quantity)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [orderId, productId, price, quantity]);

        return orderProduct;

    } catch (error) {
        throw ('Error adding product to order: ', error);
    };
};

const updateOrderProduct = async ({ id, price, quantity }) => {
    try {
        const {rows: [orderProduct]} = await client.query(`
            UPDATE order_products
            SET "price"=$1, "quantity"=$2
            WHERE id=$3
            RETURNING *;
        `, [price, quantity, id]);

        return orderProduct;
    } catch (error) {
        throw ('Error updating order product: ', error);
    };
};

const destroyOrderProduct = async (id) => {
    try {
        const {rows: [deletedOrderProduct]} = await client.query(`
            DELETE FROM order_products
            WHERE id=$1
            RETURNING *;
        `, [id]);

        return deletedOrderProduct;
    } catch (error) {
        throw ('Error destroying order product: ', error);
    };
};

module.exports = {
    getOrderProductById,
    addProductToOrder,
    updateOrderProduct,
    destroyOrderProduct,
};