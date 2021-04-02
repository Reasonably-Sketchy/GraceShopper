// const client = require(`./client`)

async function getProductById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
            SELECT *
            FROM products
            WHERE id=$1;
        `,
      [id]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows } = await client.query(`
            SELECT *
            FROM products;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createProduct({ name, description }) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
        INSERT INTO products(name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `,
      [name, description]
    );
    return product;
  } catch (error) {
    throw error;
  }
}
