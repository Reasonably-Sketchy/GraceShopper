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

const {
    getOrderById,
    getAllOrders,
    getOrdersByUser,
    getOrdersByProduct,
    getCartByUser,
    createOrder,
} = require('./orders');

const {
    getOrderProductById,
    addProductToOrder,
    updateOrderProduct,
    destroyOrderProduct,
} = require('./order_products');

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
        
        // need to change datePlaced
        await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                status TEXT DEFAULT 'created',
                "userId" INTEGER REFERENCES users(id),
                "datePlaced" TEXT DEFAULT CURRENT_DATE
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
            imageURL: 'https://www.monarchbrands.com/wp-content/uploads/2019/07/Microfiber-Cloth-Stack-2.jpg',
            inStock: true,
            category: 'Household'
        });
        await createProduct({
            name: 'Dog armor',
            description: 'armor for dogs',
            price: 500,
            imageURL: 'https://technabob.com/blog/wp-content/uploads/2017/06/pet-samurai-5.jpg',
            inStock: true,
            category: 'Pets'
        });
        await createProduct({
            name: 'Oxygen Fresh',
            description: 'environmentally friendly wash',
            price: 150,
            imageURL: 'https://cdn.pixabay.com/photo/2014/04/03/09/57/bucket-309439_960_720.png',
            inStock: true,
            category: 'household'
        });
        await createProduct({
            name: 'G-G-G-Gia!',
            description: 'Watch the hair on your statue grow. Just add water!',
            price: 800,
            imageURL: 'https://www.lilyardor.com/wp-content/uploads/2019/04/IMG_1133-1080x675.jpg', 
            inStock: true,
            category: 'garden'
        });
        await createProduct({
            name: 'Snuggle',
            description: 'who needs other people when you have fabric?',
            price: 350,
            imageURL: 'https://hip2save.com/wp-content/uploads/2020/05/woman-wearable-blanket-.jpg', 
            inStock: true,
            category: 'clothes'
        });
        await createProduct({
            name: 'Lunar Boots',
            description: 'Reach for the stars by jumping in the air like you are a 50s kid',
            price: 1000,
            imageURL: 'https://images-na.ssl-images-amazon.com/images/I/71VD%2BMbQcrL._AC_SX425_.jpg', 
            inStock: true,
            category: 'clothes'
        });
        await createProduct({
            name: 'Joe Backman BBQ',
            description: 'Cook things',
            price: 1850,
            imageURL: 'https://images-na.ssl-images-amazon.com/images/I/81YSZkz4wzL._AC_SL1500_.jpg', 
            inStock: true,
            category: 'cooking'
        });
        await createProduct({
            name: 'Slam Slice',
            description: 'it cuts food',
            price: 120,
            imageURL: 'https://images-na.ssl-images-amazon.com/images/I/512X9AqCWjL._AC_SL1000_.jpg', 
            inStock: true,
            category: 'cooking'
        });
        await createProduct({
            name: 'Drink Weight',
            description: 'work out, and stay hydrated',
            price: 200,
            imageURL: 'https://images-na.ssl-images-amazon.com/images/I/61UDS9og1qL._AC_SX425_.jpg', 
            inStock: true,
            category: 'exercise'
        });

        console.log("Finished creating products")
    } catch (error) {
        console.log("Error creating Products:", error)
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...")
        await createUser({
            first: 'Guest',
            last: 'User',
            email: 'guest@graceshopper.com',
            username: 'Guest',
            password: 'Guest123',
        })

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

        await createUser({ 
            first: 'Austin',
            last: 'Thomas',
            email: 'austin.thomas130@gmail.com',
            username: 'Austy',
            password: '12345678',
            imageURL: 'https://scontent.fsac1-2.fna.fbcdn.net/v/t1.6435-9/47215028_10216685381274403_1759716923727151104_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=IDkCTG28XV8AX963sRI&_nc_ht=scontent.fsac1-2.fna&oh=bc1a235e65071334e3bee42e68c51616&oe=60948E74',
            isAdmin: true,
        });
      
        console.log("Finished creating users!");

    } catch (error) {
        console.log("Error creating users!");
        throw error
    }
}


async function createInitialOrders(){

    try {
        console.log("Starting to create orders...")

        await createOrder({
            status: 'created',
            userId: 2,
        })
        await createOrder({
            status: 'cancelled',
            userId: 3,
        })
        await createOrder({
            status: 'completed',
            userId: 4,
        })

        await createOrder({
            status: 'created',
            userId: 5,
        });

        await createOrder({
            status: 'completed',
            userId: 5,
        });

        console.log("Finished creating orders!");
    } catch (error) {
        console.log("Error creating orders!")
        throw error
    }
}

async function createInitialOrderProducts() {
    try {
        console.log("Starting to create order_products...")

        await addProductToOrder({
            orderId: 4,
            productId: 1,
            price: 100,
            quantity: 1,
        });

        await addProductToOrder({
            orderId: 4,
            productId: 2,
            price: 1000,
            quantity: 2,
        });

        await addProductToOrder({
            orderId: 5,
            productId: 1,
            price: 300,
            quantity: 3,
        });

        await addProductToOrder({
            orderId: 5,
            productId: 3,
            price: 70,
            quantity: 10,
        });

        console.log("Finished creating order products!")
    } catch (error) {
        console.error("Error creating Products")
        throw error;
    }
};

// RebuildDB function:

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialProducts();
        await createInitialUsers();
        await createInitialOrders();
        await createInitialOrderProducts();
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    };
};

module.exports = {
    rebuildDB,
};