const express = require("express");
const { getAllorders, getOrdersById, addProductToOrder, getProductById, deleteOrder } = require("../db");

const ordersRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const {
  client,
  getAllOrders,
  updateOrder,
  getOrderById,
  getCartByUser,
  createOrder,
} = require("../db");

ordersRouter.use((req, res, next) => {
  console.log("A request is being made to /orders...");
  next();
});

ordersRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.post('/:orderId/products', async (req, res, next) => {
    const {productId, price, quantity} = req.body;
    const {orderId} = req.params;

    if (!productId || !price || !quantity) {
      throw Error('Please fill out all required fields.');
    };

    try {        
        const _order = await getOrderById(orderId);
        if (!_order) {
          throw Error('That order does not exist.');
        };

        const product = await getProductById(productId);

        const productAdd = await addProductToOrder({
          orderId: Number(orderId),
          productId: productId,
          price: price,
          quantity: quantity
        });

        const dataToSend = {
          orderProductId: productAdd.id,
          productId: productAdd.productId,
          name: product.name,
          description: product.description,
          imageURL: product.imageURL,
          price: productAdd.price,
          quantity: productAdd.quantity,
        };

        res.send(dataToSend);

    } catch ({name, message}) {
        next({name, message});
    }; 
});


ordersRouter.get("/cart", requireUser, async (req, res, next) => {
  const user = req.user;
  try {
    const cart = await getCartByUser(user);
    if (!cart) {
      throw Error('No active user cart.')
    };
    res.send(cart);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.post("/", async (req, res, next) => {
  
  // This block handles guest orders vs user carts
  const fields = {};
  if (req.user) {
    fields.userId = req.user.id;
    fields.status = "created";
  } else if (!req.user) {
    fields.userId = 1;
    fields.status = "completed"
  };
  // 

  try {
    const order = await createOrder(fields);
    res.send(order);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ordersRouter.patch('/:orderId', requireUser, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId, status } = req.body;
    const orderToUpdate = await getOrderById(orderId);
    if (!orderToUpdate) {
      throwError('That order does not exist.')
    };

    const updatedOrder = await updateOrder({
      id: orderId, 
      status: status, 
      userId: userId,
    });

    if (!updatedOrder) {
      throw Error('Update order error');
    };
    console.log('UPDATED: ', updatedOrder);

    res.send(updatedOrder);
  } catch (error) {
    next(error);
  };
})

ordersRouter.delete("/:orderId", requireUser, async(req, res, next)=>{
    const { orderId } = req.params;

    try {
      const orderToDelete = await getOrderById(orderId);
      if (!orderToDelete) {
        throw Error(`You can't delete an order that doesn't exist.`);
      };
      const deletedOrder = await deleteOrder(orderToDelete);
      
      res.send(deletedOrder);
    } catch ({ name, message }) {
      next({ name, message });
    };
});

module.exports = ordersRouter;
