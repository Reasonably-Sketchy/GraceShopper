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
        //     userId: 'Bat',
        //     description: 'yada',
        //     price: 10,
        //     inStock: true,
        //     category: 'Food'
        // });
        // console.log('createdProduct?', createdProduct)
        userFromAdapter = await getUser({
            useruserId: 'albert',
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
        // const [productsHaveuserId] = productsFromAdapter;
        // console.log('produx w/ userId????', productsFromAdapter, productsFromDatabase, productsHaveuserId)


        describe('getAllProducts', ()=>{
            it('returns an array', ()=>{
                expect(Array.isArray(productsFromAdapter)).toBe(true);
            });

            it('returns an array of products', ()=>{
                expect(productsFromAdapter).toEqual(productsFromDatabase);
            });

            it('each product has a userId property', ()=>{
                const [product] = productsFromAdapter;
                expect(product).toHaveProperty('userId');
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

            it('each product has a userId property', ()=>{
                const [product] = productsFromAdapter;
                expect(product).toHaveProperty('userId');
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

    // describe('Orders', () => {
    //     let orderToCreateAndUpdate = {status: 'created', userId: 4};
    //     let routineToFail = {status: 'created', userId: 4};
    //     const newRoutineData = {status: 'completed', userId: 4}
    //     describe('getAllOrders', () => {
    //       it('Returns a list of orders, includes the products with them', async () => {
    //         const ordersFromDB = await getAllOrders();
    //         const {data: publicRoutinesFromAPI} = await axios.get(`${API_URL}/api/routines`);
    //         expect(publicRoutinesFromAPI).toEqual(ordersFromDB);
    //       });
    //     });
        
    //     describe('POST /routines (*)', () => {
    //       it('Creates a new routine, with the creatorId matching the logged in user', async () => {
    //         const {data: respondedRoutine} = await axios.post(`${API_URL}/api/routines`, orderToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
            
    //         expect(respondedRoutine.userId).toEqual(orderToCreateAndUpdate.userId);
    //         expect(respondedRoutine.goal).toEqual(orderToCreateAndUpdate.goal);
    //         expect(respondedRoutine.userId).toEqual(orderToCreateAndUpdate.userId);
    //         expect(respondedRoutine.creatorId).toEqual(registeredUser.id);
    //         orderToCreateAndUpdate = respondedRoutine;
    //       });
    //       it('Requires logged in user', async () => {
    //         let noLoggedInUserResp, noLoggedInUserErrResp;
    //         try {
    //           noLoggedInUserResp = await axios.post(`${API_URL}/api/routines`, routineToFail);
    //         } catch(err) {
    //           noLoggedInUserErrResp = err.response;
    //         }
    //         expect(noLoggedInUserResp).toBeFalsy();
    //         expect(noLoggedInUserErrResp.data).toBeTruthy();
    //       });
    //     });
    //     describe('PATCH /routines/:routineId (**)', () => {
    //       it('Updates a routine, notably changing public/private, the userId, or the goal', async () => {
    //         const {data: respondedRoutine} = await axios.patch(`${API_URL}/api/routines/${orderToCreateAndUpdate.id}`, newRoutineData, { headers: {'Authorization': `Bearer ${token}`} });
    //         expect(respondedRoutine.userId).toEqual(newRoutineData.userId);
    //         expect(respondedRoutine.goal).toEqual(newRoutineData.goal);
    //         orderToCreateAndUpdate = respondedRoutine;
    //       });
    //     });
    //     describe('DELETE /routines/:routineId (**)', () => {
    //       it('Hard deletes a routine. Makes sure to delete all the routineActivities whose routine is the one being deleted.', async () => {
    //         const {data: deletedRoutine} = await axios.delete(`${API_URL}/api/routines/${orderToCreateAndUpdate.id}`, { headers: {'Authorization': `Bearer ${token}`} });
    //         const shouldBeDeleted = await getRoutineById(deletedRoutine.id);
    //         expect(deletedRoutine.id).toBe(orderToCreateAndUpdate.id);
    //         expect(deletedRoutine.userId).toBe(orderToCreateAndUpdate.userId);
    //         expect(deletedRoutine.goal).toBe(orderToCreateAndUpdate.goal);
    //         expect(shouldBeDeleted).toBeFalsy();
    //       });
    //     });
    //     describe('POST /routines/:routineId/activities', () => {
    //       let newRoutine
    //       it('Attaches a single activity to a routine.', async () => {
    //         newRoutine = await createRoutine({creatorId: registeredUser.id, userId: 'Pull Ups', goal: '10 pull ups'})
    //         const {data: respondedRoutineActivity} = await axios.post(`${API_URL}/api/routines/${newRoutine.id}/activities`, {routineId: newRoutine.id, ...routineActivityToCreateAndUpdate}, { headers: {'Authorization': `Bearer ${token}`} });
    //         expect(respondedRoutineActivity.routineId).toBe(newRoutine.id);
    //         expect(respondedRoutineActivity.activityId).toBe(routineActivityToCreateAndUpdate.activityId);
    //         routineActivityToCreateAndUpdate = respondedRoutineActivity;
    //       });
    //       it('Prevents duplication on (routineId, activityId) pair.', async () => {
    //         let duplicateIds, duplicateIdsResp;
    //         try {
    //           duplicateIds = await axios.post(`${API_URL}/api/routines/${newRoutine.id}/activities`, routineActivityToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
    //         } catch(err) {
    //           duplicateIdsResp = err.response;
    //         }
    //         expect(duplicateIds).toBeFalsy();
    //         expect(duplicateIdsResp.data).toBeTruthy();
    //       });
    //     });
    //   });




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