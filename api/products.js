const express = require("express");
const productsRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");
const {
  client,
  updatePost,
  getPostById,
  getAllProducts,
  getProductById,
  createProduct,
  destroyProduct,
  updateProduct,
  getOrdersByProduct,
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

productsRouter.post('/', requireAdmin, async (req, res, next) => {
  const { name, description, price, imageURL, inStock, category } = req.body;

  const product = {
    name: name,
    description: description, 
    price: price,
    category: category 
  };

  if (imageURL) {
    product.imageURL = imageURL;
  };
  
  if (typeof inStock == 'boolean') {
    product.inStock = inStock;
  };

  try {
    const newProduct = await createProduct(product);
    res.send(newProduct);
  } catch ({ name, message }) {
    next({ name, message });
  };
});


productsRouter.delete("/:productId", requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  
  try {
    const productToDelete = await getProductById(productId);
    if (!productToDelete) {
      throw Error(`You can't delete a product that doesn't exist.`);
    };
    const deletedProduct = await destroyProduct(productToDelete);
    
    res.send(deletedProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.patch(':/productId', requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  // const { id, name, description, price, imageURL, inStock, category } = req.body;

  try {
    const productToUpdate = await getProductById(productId);
    if (!productToUpdate) {
      throw Error(`You can't update a product that doesn't exist.`);
    };
    const updatedProduct = await updateProduct(req.body);

    res.send(updatedProduct);
  } catch ({ name, message }) {
    next({ name, message });
  };
});


productsRouter.get('/:productId/orders', requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  try {
    const ordersByProduct = getOrdersByProduct({id: productId});
    res.send(ordersByProduct);
  } catch ({ name, message }) {
    next({ name, message });
  };
});


module.exports = productsRouter;
