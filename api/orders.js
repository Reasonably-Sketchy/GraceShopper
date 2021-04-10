const express = require("express");
const { getAllorders, getOrdersById } = require("../db");

const ordersRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const {
  client,
  getAllOrders,
  updateOrder,
  getOrderById,
  getCartByUser,
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

// productsRouter.get("/:ordersId", async (req, res, next) => {
//   const { orderId } = req.params;
//   try {
//     const product = await getProductById(productId);

//     if (!product) {
//       throw Error("That product does not exist");
//     }

//     res.send(product);
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// productsRouter.use((req, res, next) => {
//   console.log("A request is being made to /products");
//   next();
// });

// productsRouter.delete("/:postId", requireUser, async (req, res, next) => {
//   try {
//     const post = await getProductById(req.params.postId);

//     if (post && post.author.id === req.user.id) {
//       const updatedPost = await updatePost(post.id, { active: false });

//       res.send({ post: updatedPost });
//     } else {
//       // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
//       next(
//         post
//           ? {
//               name: "UnauthorizedUserError",
//               message: "You cannot delete a post which is not yours",
//             }
//           : {
//               name: "ProductNotFoundError",
//               message: "That product does not exist",
//             }
//       );
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

ordersRouter.get("/cart", requireUser, async (req, res, next) => {
  const user = req.user;
  try {
    const cart = await getCartByUser(user);

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


ordersRouter.patch('/orders/:orderId', 
    requireUser, 
    requiredNotSent({requiredParams: ['id', 'userId']}), 
    async (req, res, next)=>{
        try {
            const {orderId} = req.params;
            const iExist = await getOrderById(orderId);
            if(!iExist) {
                next({   
                    name: 'iDontExist',
                    message: `Order ${orderId} does not exist`
                })
            } else {
                const {id, userId} = req.body;
                const updatedOrder = await updateOrder({id: orderId, id, userId})
                if(updatedOrder){
                    res.send(updatedOrder)
                } else {
                    next({
                        name: 'FailedToUpdate',
                        message: 'Your order could not be updated'
                    })
                }
            }
        } catch (error) {
            next(error)
        }
})

ordersRouter.delete("/orders/:orderId", requireUser, async(req, res, next)=>{
    try {
        const thisOrder = await getOrderById(req.params.orderId);

        if (thisOrder && thisOrder.author.id === req.params.orderId) {
            const 
        } else {
            thisOrder
                ? {
                    name: "UnauthorizedUserError",
                    message: "You cannot cancel an order that is not yours"
                    }
                : {
                    name: "NotFoundError",
                    message: "You dun goofed, how did you even get here?"
                }
        }

    } catch ({name, message}) {
        next({name, message});
    }
});

module.exports = productsRouter;
