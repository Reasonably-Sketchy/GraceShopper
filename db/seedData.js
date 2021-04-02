// Require client
const client = require('./client');
// Import adapter functions


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
                name varchar(255) NOT NULL,
                description varchar(255) NOT NULL,
                price NOT NULL,
                imageURL DEFAULT,
                inStock NOT NULL DEFAULT false,
                category NOT NULL
            );
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                firstName varchar(255) NOT NULL, 
                lastName varchar(255) NOT NULL,
                email UNIQUE NOT NULL, 
                imageURL DEFAULT,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) UNIQUE NOT NULL,
                "isAdmin" NOT NULL DEFAULT false
            );
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                status DEFAULT "created",
                "userId" REFERENCES users(id),
                "datePlaced" current_date
            );
            CREATE TABLE order_products (
                id SERIAL PRIMARY KEY,
                "productId" REFERENCES products(id),
                "orderId" REFERENCES orders(id),
                price NOT NULL,
                quantity NOT NULL DEFAULT 0
            )
        `)

        console.log("Finished building tables!")

    } catch (error) {
        console.error("Error building tables!")
    }
}

// Add "create" functions with seed data for tables
async function createInitialProducts() {
    try {
        console.log("Starting to create products...")

        await createProducts({
            name: 'ScamWOW!',
            description: 'it is just a towel',
            price: 100.99,
            inStock: true,
            category: 'Household'
        });
        await createProducts({
            name: 'Dog armor',
            description: 'armor for dogs',
            price: 500,
            inStock: true,
            category: 'Pets'
        });
        await createProducts({
            name: 'Pasta Aglio e Olio',
            description: 'fresh hot pasta',
            price: '7 bucks',
            inStock: true,
            category: 'Food'
        });

        console.log("Finished creating products")
    } catch (error) {
        console.log("Error creating Products!")
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
            username: 'albert', 
            password: 'bertie99',
            firstName: 'Al',
            lastName: 'Bert',
            email: 'albert@bert.org' 
        });
        await createUser({ 
            username: 'sandra', 
            password: '2sandy4me',
            firstName: 'Sandra',
            lastName: 'Butter',
            email: 'sandra@sandie.net'
        });
        await createUser({ 
            username: 'glamgal',
            password: 'soglam',
            firstName: 'Josh',
            lastName: 'Glam',
            email: 'josh@glam.com'
        });
      
        console.log("Finished creating users!");

    } catch (error) {
        console.error("Error creating users!");
        throw error
    }
}

async function createInitialOrders(){
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log("Starting to create orders...")
        
        await createOrders({
            status: 'created',
            userId: albert.id,
            date: "today"
        })
        await createOrders({
            status: 'cancelled',
            userId: sandra.id,
            date: "today"
        })
        await createOrders({
            status: 'completed',
            userId: glamgal.id,
            date: "today"
        })

        console.log("Finished creating orders!");
    } catch (error) {
        console.log("Error creating orders!")
        throw error
    }
}

async function createInitialProducts() {
    try {
        console.log("Starting to create products...")



        console.log("Finished creating products!")
    } catch (error) {
        console.error("Error creating Products")
        throw error;
    }
}

// RebuildDB function:

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialProducts();
        await createInitialUsers();
        await createInitialOrders();
        // await createInitialOrderProducts();
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    };
};

module.exports = {
    rebuildDB,
};