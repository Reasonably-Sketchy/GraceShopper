// Require client
const client = require('./client');
// Import adapter functions

// Drop tables

// Create tables

// Add "create" functions with seed data for tables

// RebuildDB function:

// const rebuildDB = async () => {
//     try {
//         client.connect();
//         await dropTables();
//         await createTables();
//         await createInitialProducts();
//         await createInitialUsers();
//         await createInitialOrders();
//         await createInitialOrderProducts();
//     } catch (error) {
//         console.log('Error during rebuildDB');
//         throw error;
//     };
// };

// module.exports = {
//     rebuildDB,
// };