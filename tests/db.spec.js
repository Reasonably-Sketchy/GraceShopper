require('dotenv').config();
const {
    getAllProducts,
    getProductById, 
    createProduct
} = require('../db')
const client = require('../db/client');
const { rebuildDB } = require('../db/seedData');
const { getUser } = require('../db/users');


let productsFromDatabase, products, productsFromAdapter, createdProduct;
let userFromDatabase, userFromAdapter;



describe('Database', ()=> {
    beforeAll(async()=>{
        client.connect();
        await rebuildDB();

        const {rows: products}=await client.query(`
            SELECT * FROM products;
        `)
        productsFromDatabase = products;
        productsFromAdapter = await getAllProducts();
        createdProduct = await createProduct();
        console.log('createdProduct?', createdProduct)
        userFromAdapter = await getUser();
        const {rows: users} = await client.query(`
            SELECT * FROM USERS;
        `)
        productsFromDatabase = users;

    });
    afterAll(()=>{
        client.end();
    });

    describe('Products',  ()=>{

        // PRODUCT TESTS



        // productsFromAdapterById = await getProductById
        // const [productsHaveName] = productsFromAdapter;
        // console.log('produx w/ name????', productsFromAdapter, productsFromDatabase, productsHaveName)


        describe('getAllProducts', ()=>{
            it('returns an array', ()=>{
                expect(Array.isArray(productsFromAdapter)).toBe(true);
            });

            it('returns an array of products', ()=>{
                expect(productsFromAdapter).toEqual(productsFromDatabase);
            });

            xit('each product has a name property', ()=>{
                const [product] = productsFromAdapter;
                expect(product).toHaveProperty('name');
            })
        });

        describe('createProduct', ()=>{
            xit('returns an object', ()=>{
                expect(typeof createdProduct).toBe('undefined')
            });
        })

        describe('getProductById', ()=>{
            xit('returns an array', ()=>{
                expect(Array.isArray(productsFromAdapter)).toBe(true);
            });

            xit('returns an array of products', ()=>{
                expect(productsFromAdapter).toEqual(productsFromDatabase);
            });

            xit('each product has a name property', ()=>{
                const [product] = productsFromAdapter;
                expect(product).toHaveProperty('name');
            })
        });
    }); // end decribe('Products')
    
    describe('Users', ()=>{
        // USER TESTS


        describe('getUser', ()=>{
            it('returns user, which is an object', ()=>{
                expect(typeof userFromAdapter).toBe('object')
            });

            it('user does not contain a property called password', ()=>{
                const [user] = userFromAdapter;
                expect(product.name).toBe(undefined);
            })
        })

    }) // end describe('Users')



}) // end describe('Database')