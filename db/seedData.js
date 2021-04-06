// Require client
const client = require('./client');
// Import adapter functions
const {     
    getProductById,
    getAllProducts,
    createProduct,
} = require('./products');

const {
    createUser,
    getUser,
    getUserById,
    getUserByUserName,
    getAllUsers,
} = require('./users');


// Drop tables
async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS order_products;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS products; 
        `);

        console.log("Finished dropping tables!")
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}


// Create tables
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description VARCHAR(255) NOT NULL,
                price FLOAT NOT NULL,
                "imageURL" VARCHAR(255),
                "inStock" BOOLEAN DEFAULT false,
                category VARCHAR(255) NOT NULL
            );
        `)

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                first VARCHAR(255) NOT NULL, 
                last VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL, 
                "imageURL" VARCHAR(255),
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "isAdmin" BOOLEAN DEFAULT false
            );
        `)
        
        await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                status TEXT DEFAULT 'created',
                "userId" INTEGER REFERENCES users(id),
                "datePlaced" DATE
            );
        `)

        await client.query(`
            CREATE TABLE order_products (
                id SERIAL PRIMARY KEY,
                "productId" INTEGER REFERENCES products(id) NOT NULL,
                "orderId" INTEGER REFERENCES orders(id) NOT NULL,
                price FLOAT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0
            );
        `)

        console.log("Finished building tables!")
    } catch (error) {
        console.error("Error building tables!")
        console.error(error)
    }
}


// Add "create" functions with seed data for tables
async function createInitialProducts() {
    try {
        console.log("Starting to create products...")
      
        await createProduct({
            name: 'ScamWOW!',
            description: 'it is just a towel',
            price: 100,
            // CHANGE IMAGEURL TO DEPLOY URL
            imageURL: 'http://localhost:3001/assets/scamwow.jpg',
            inStock: true,
            category: 'Household'
        });
        await createProduct({
            name: 'Dog armor',
            description: 'armor for dogs',
            price: 500,
            inStock: true,
            category: 'Pets'
        });
        await createProduct({
            name: 'Pasta Aglio e Olio',
            description: 'fresh hot pasta',
            price: 7,
            inStock: true,
            category: 'Food'
        });

        console.log("Finished creating products")
    } catch (error) {
        console.log("Error creating Products:", error)
    }
}

async function createInitialOrders() {
    try {
        console.log("Starting to create orders...");

    } catch (error) {
        console.log("Error creating orders!");
        throw error
    }
}


async function createInitialUsers() {
    try {
        console.log("Starting to create users...")

        await createUser({ 
            first: 'Al',
            last: 'Bert',
            email: 'albert@bert.org', 
            username: 'albert', 
            password: 'bertie99',
        });
      
        await createUser({ 
            first: 'Sandra',
            last: 'Butter',
            email: 'sandra@sandie.net',
            username: 'sandra', 
            password: '2sandy4me',
        });
      
        await createUser({ 
            first: 'Josh',
            last: 'Glam',
            email: 'josh@glam.com',
            username: 'glamgal',
            password: 'soglam',
        });
      
        console.log("Finished creating users!");

    } catch (error) {
        console.log("Error creating users!");
        throw error
    }
}

// async function createInitialOrders(){
//     try {
//         // const [albert, sandra, glamgal] = await getAllUsers();
//         console.log(await getAllUsers())
//         console.log("Starting to create orders...")
        
//         await createOrder({
//             status: 'created',
//             userId: albert.id,
//             date: "today"
//         })
//         await createOrder({
//             status: 'cancelled',
//             userId: sandra.id,
//             date: "today"
//         })
//         await createOrder({
//             status: 'completed',
//             userId: glamgal.id,
//             date: "today"
//         })

//         console.log("Finished creating orders!");
//     } catch (error) {
//         console.log("Error creating orders!")
//         throw error
//     }
// }

// async function createInitialOrderProducts(order_products) {

//     const [productOne, productTwo, productThree] = order_products

//     try {
//         console.log("Starting to create order_products...")

//         const orderOne = await createOrderProducts(productOne.id, {
//             content: "This should be an order for ScamWOW!"
//         });

//         const orderTwo = await createOrderProducts(productTwo.id, {
//             content: "This should be an order for dog armor"
//         });

//         const orderThree = await createOrderProducts(productThree.id, {
//             content: "this should be an order for pasta"
//         });

//         console.log("Finished creating products!")

//         return [orderOne, orderTwo, orderThree];
//     } catch (error) {
//         console.error("Error creating Products")
//         throw error;
//     }
// }

// RebuildDB function:

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialProducts();
        await createInitialUsers();
        // await createInitialOrders();
        // await createInitialOrderProducts();
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    };
};

module.exports = {
    rebuildDB,
};