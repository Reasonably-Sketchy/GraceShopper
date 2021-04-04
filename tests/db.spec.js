const {
    getAllProducts,
    getProductById
} = require('../db')
const client = require('../db/client');
const { rebuildDB } = require('../db/seedData');


let productsFromDatabase, products, productsFromAdapter;

// productsFromAdapter = await getAllProducts();

describe('Database', ()=> {
    beforeAll(async()=>{
        client.connect();
        await rebuildDB();
        const {rows}=await client.query(`
            SELECT * FROM products;
        `)
        productsFromDatabase = rows;
        productsFromAdapter = await getAllProducts();
        // productsFromAdapterById = await getProductById

    });

    describe('getAllProducts', ()=>{
        it('returns an array', ()=>{
            expect(Array.isArray(productsFromAdapter)).toBe(true);
        });

        it('returns an array of products', ()=>{
            expect(productsFromAdapter).toEqual(productsFromDatabase);
        });

        it('each product has a name property', ()=>{
            const [product] = productsFromAdapter;
            expect(product).toHaveProperty('name');
        })
    });

    describe('getProductById', ()=>{
        it('returns an array', ()=>{
            expect(Array.isArray(productsFromAdapter)).toBe(true);
        });

        it('returns an array of products', ()=>{
            expect(productsFromAdapter).toEqual(productsFromDatabase);
        });

        it('each product has a name property', ()=>{
            const [product] = productsFromAdapter;
            expect(product).toHaveProperty('name');
        })
    });

    afterAll(()=>{
        client.end();
    });

})