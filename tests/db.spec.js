require('dotenv').config();
const {
    getAllProducts,
    getProductById, 
    createProduct,

    getOrderProductById,
    addProductToOrder,
    updateOrderProduct,
    destroyOrderProduct,
    getAllOrders,
    getOrdersByUser,
    getOrdersByProduct,
    getCartByUser,
} = require('../db')

const client = require('../db/client');
const { rebuildDB } = require('../db/seedData');
const { getUser, createUser } = require('../db/users');


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
        productsFromAdapter = await getAllProducts();
        userFromAdapter = await getUser({
            username: 'albert',
            password: 'bertie99',
        });
        const {rows: users} = await client.query(`
            SELECT * FROM USERS;
        `)

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
        // const [productsHaveuserId] = productsFromAdapter;
        // console.log('produx w/ userId????', productsFromAdapter, productsFromDatabase, productsHaveuserId)


        describe('getAllProducts', ()=>{
            it('returns an array', ()=>{
                expect(Array.isArray(productsFromAdapter)).toBe(true);
            });

            it('returns an array of products', ()=>{
                expect(productsFromAdapter).toEqual(productsFromDatabase);
            });
        });

        describe('createProduct', ()=>{

            it('should create and return a new product', async () => {
              const newProduct = { 
                name: 'NoFlex',
                description: '0% guaranteed to get you jacked.',
                price: 5000,
                inStock: true,
                category: 'Fitness',
              };
              const createdProduct = await createProduct(newProduct);
              expect(createdProduct.name).toBe(newProduct.name);
              expect(createdProduct.description).toBe(newProduct.description);
            });
        });

        describe('getProductById', ()=>{

            it('should return a product from the database', async ()=>{
                const product = await getProductById(1);
                expect(product.name).toBeTruthy();
            });

            it('should return the correct product', async () => {
              const product = await getProductById(1);
              expect(product.id).toBe(1);
            })


        });
    }); // end decribe('Products')
    
    describe('Users', ()=>{
        // USER TESTS
        describe('getUser', ()=>{
            it('returns user, which is an object', ()=>{
                expect(typeof userFromAdapter).toBe('object')
            });

            it('returns the correct user', async () => {
              const user = await getUser({username: 'Austy', password: '12345678'});
              expect(user.username).toBe('Austy')
            });

            it('user does not contain a property called password', ()=>{
                const user = userFromAdapter;
                expect(user.password).toBe(undefined);
            });
        });

        describe('createUser', () => {
          it('successfully creates and returns a new user', async () => {
            const userToCreate = {
              first: 'George',
              last: 'Foreman',
              email: 'georgie_be_grillin@gmail.com',
              username: 'grillmaster',
              password: 'alwaysBgri11in'
            };
            const createdUser = await createUser(userToCreate);
            expect(createdUser.name).toBe(userToCreate.name);
            expect(createdUser.email).toBe(userToCreate.email);
          });

        });

    }) // end describe('Users')

    describe('Orders', () => {

      let allOrders;
      let databaseOrders;
      let user;
      let testProduct;
      beforeAll(async () => {
        allOrders = await getAllOrders();
        const {rows} = await client.query(`
          SELECT *
          FROM orders;
        `);
        databaseOrders = rows;
        user = await getUser({username: 'Austy', password: '12345678'});
      });


      describe('getAllOrders', () => {

        it('returns an array', () => {
          expect(Array.isArray(allOrders)).toBe(true);
        });

        it('returns an array of orders from the database', () => {
          expect(allOrders[0].id).toBe(databaseOrders[0].id);
          expect(allOrders[0].userId).toBe(databaseOrders[0].userId);
        });

        it('returns orders that include products', () => {
          expect(allOrders[3].products).toBeTruthy();
        });
      });

      describe('getOrdersByUser', () => {
        it(`returns the user's orders`, async () => {
          const userOrders = await getOrdersByUser(user);
          const databaseUserOrders = databaseOrders.filter((order) => {return order.userId == user.id});
          expect(userOrders[0].id).toEqual(databaseUserOrders[0].id);
        });
      });

      describe('getOrdersByProduct', () => {
        it(`returns orders that contain the product`, async () => {
          const testProduct = productsFromDatabase[0]
          const productOrders = await getOrdersByProduct(testProduct);
          // expect(productOrders[0].products)
        })
      });

      describe('getCartByUser', () => {
        it(`returns the user's cart`, async () => {
          const userCart = await getCartByUser(user);
          const databaseUserOrders = databaseOrders.filter((order) => {return order.userId == user.id});
          const databaseUserCart = databaseUserOrders.find((order) => {return order.status == 'created'})
          expect(userCart.status).toEqual(databaseUserCart.status);

        })
      })

    })

    describe('Order Products', () => {
        const orderProductData = {
          orderId: 1,
          productId: 1,
          price: 1000,
          quantity: 10000 
        }
        let orderProductToCreateAndUpdate;
        describe('addProductToOrder({ orderId, productId, price, quantity })', () => {
          it('creates a new order_product, and return it', async () => {
            orderProductToCreateAndUpdate = await addProductToOrder(orderProductData);
            expect(orderProductToCreateAndUpdate.orderId).toBe(orderProductData.orderId);
            expect(orderProductToCreateAndUpdate.productId).toBe(orderProductData.productId);
            expect(orderProductToCreateAndUpdate.price).toBe(orderProductData.price);
            expect(orderProductToCreateAndUpdate.quantity).toBe(orderProductData.quantity);
          })
        })
        describe('updateOrderProduct({ id, price, quantity })', () => {
          it('Finds the order with id equal to the passed in id. Updates the price or quantity as necessary.', async () => {
            const neworderProductData = {id: orderProductToCreateAndUpdate.id, price: 15, quantity: 150};
            orderProductToCreateAndUpdate = await updateOrderProduct(neworderProductData);
            expect(orderProductToCreateAndUpdate.id).toBe(neworderProductData.id);
            expect(orderProductToCreateAndUpdate.price).toBe(neworderProductData.price);
            expect(orderProductToCreateAndUpdate.quantity).toBe(neworderProductData.quantity);
          })
        })
        describe('destroyOrderProduct(id)', () => {
          it('remove order_product from database', async () => {
            const deletedOrderProduct = await destroyOrderProduct(orderProductToCreateAndUpdate.id);
            expect(deletedOrderProduct.id).toBe(orderProductToCreateAndUpdate.id);
            const {rows} = await client.query(`
              SELECT * FROM order_products
              WHERE id = ${deletedOrderProduct.id}
            `)
            expect(rows.length).toBe(0);
          })
        })
    
      })
});// end describe('Database')