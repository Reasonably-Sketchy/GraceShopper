const express = require("express");
const productsRouter = express.Router();
const { requireUser } = require("./utils");
const {
  client,
  updatePost,
  getPostById,
  getAllProducts,
  getProductById,
} = require("../db");

productsRouter.use((req, res, next) => {
  console.log("A request is being made to /products...");
  next();
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);

    if (!product) {
      throw Error("That product does not exist");
    }

    res.send(product);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.use((req, res, next) => {
  console.log("A request is being made to /products");
  next();
});

productsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getProductById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "ProductNotFoundError",
              message: "That product does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// productsRouter.get("/active", async (req, res, next) => {
//   try {
//     const allProducts = await getAllProducts();

//     const products = allProducts.filter((product) => {
//       return product.active;
//       //   || (req.user && post.author.id === req.user.id)
//     });

//     res.send({
//       products,
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

module.exports = productsRouter;
