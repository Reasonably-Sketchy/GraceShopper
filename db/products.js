const client = require(`./client`)

async function getProductById(id) {
  try {
    const { rows: [product] } = await client.query(
      `
            SELECT *
            FROM products
            WHERE id=$1;
        `, [id]
    );

    return product;
  } catch (error) {
    throw error;
  };
};


async function getAllProducts() {
  try {
    const { rows } = await client.query(`
            SELECT *
            FROM products;
        `);
        console.log('ROWS', rows)
    return rows;
  } catch (error) {
    throw error;
  };
};


async function createProduct({ name, description, price, imageURL, inStock, category }) {

    let image;
    if (!imageURL) {
        image = '';
    } else {
        image = imageURL;
    };

    try {
        const { rows: [product] } = await client.query(
        `
            INSERT INTO products(name, description, price, "imageURL", "inStock", category)
            VALUES($1, $2, $3, $4, $5, $6)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, description, price, image, inStock, category]);

        return product;
    } catch (error) {
        throw error;
    };
};

async function attachProductsToOrders(orders) {
  // no side effects
  const ordersToReturn = [...orders];
  const binds = orders.map((_, index) => `$${index + 1}`).join(', ');
  const orderIds = orders.map(order => order.id);
  if (!orderIds?.length) return;
  
  try {
    const { rows: products } = await client.query(`
      SELECT products.*, order_products.quantity, order_products.price, order_products.id AS "orderProductId", order_products."orderId"
      FROM products 
      JOIN order_products ON order_products."productId" = products.id
      WHERE order_products."orderId" IN (${ binds });
    `, orderIds);

    for(const order of ordersToReturn) {
      const productsToAdd = products.filter(product => product.orderId === order.id);
      order.products = productsToAdd;
    };

    return ordersToReturn;
  } catch (error) {
    throw error;
  };
};

const updateProduct = async ({ id, name, description, price, imageURL, inStock, category }) => {
  try {
    const { rows: productToUpdate } = await client.query(`
      UPDATE products
      SET "name"=$1, "description"=$2, "price"=$3, "imageURL"=$4, "inStock"=$5, "category"=$6
      WHERE id=$7
      RETURNING *;
    `, [name, description, price, imageURL, inStock, category, id]);

    return productToUpdate;
  } catch (error) {
    throw error;
  };
};

const destroyProduct = async ({ id }) => {
  try {
    const { rows: productToDelete } = await client.query(`
      DELETE FROM products
      WHERE id=$1
      RETURNING *;
    `, [id]);

    return productToDelete;
  } catch (error) {
    throw error;
  };
};

module.exports = {
    getProductById,
    getAllProducts,
    createProduct,
    attachProductsToOrders,
    updateProduct,
    destroyProduct,
}