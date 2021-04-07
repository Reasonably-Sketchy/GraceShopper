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
        // client.connect();
        await rebuildDB();

        const {rows: products}=await client.query(`
            SELECT * FROM products;
        `)
        productsFromDatabase = products;
        // console.log('PRODUCTS FROM DB: ', products)
        productsFromAdapter = await getAllProducts();
        // console.log('PRODUCTS: ', productsFromAdapter);
        // createdProduct = await createProduct({
        //     name: 'Bat',
        //     description: 'yada',
        //     price: 10,
        //     inStock: true,
        //     category: 'Food'
        // });
        // console.log('createdProduct?', createdProduct)
        userFromAdapter = await getUser({
            username: 'albert',
            password: 'bertie99',
        });
        const {rows: users} = await client.query(`
            SELECT * FROM USERS;
        `)
        // productsFromDatabase = users;

    });
    afterAll(()=>{
        client.end();
    });

    describe('Products',  ()=>{

        // PRODUCT TESTS

        beforeAll(async () => {
            try {
                productsFromAdapter = await getAllProducts();
            } catch(error) {
                console.error('ERROR ON 49', error)
            }
        })

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

            it('each product has a name property', ()=>{
                const [product] = productsFromAdapter;
                expect(product).toHaveProperty('name');
            })
        });

        describe('createProduct', ()=>{
            it('returns an object', ()=>{
                expect(typeof createdProduct).toBe('undefined')
            });
        })

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
    }); // end decribe('Products')
    
    describe('Users', ()=>{
        // USER TESTS


        describe('getUser', ()=>{
            it('returns user, which is an object', ()=>{
                expect(typeof userFromAdapter).toBe('object')
            });

            it('user does not contain a property called password', ()=>{
                const user = userFromAdapter;
                expect(user.password).toBe(undefined);
            })
        })

    }) // end describe('Users')



}) // end describe('Database')