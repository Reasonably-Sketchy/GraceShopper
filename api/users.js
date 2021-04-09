const { JWT_SECRET = "landfillbait" } = process.env;
// NEED TO MOVE TO PROCESS.ENV ^^^
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
  getOrdersByUser,
  getCartByUser,
} = require("../db");
const bcrypt = require("bcrypt");
const { requireUser, requireAdmin } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users...");
  next();
});

usersRouter.post("/register", async (req, res, next) => {
  console.log("HERE");
  const { first, last, email, username, password } = req.body;
  try {
    if (password.length <= 7) {
      next({
        name: "ShortPasswordError",
        message: "Password must be longer than 7 characters.",
      });
      return;
    }
    const _user = await getUserByUserName(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
      return;
    }
    const user = await createUser({
      first: first,
      last: last,
      email: email,
      username: username,
      password: password,
    });
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    console.log("USER", user);
    res.send({
      message: "thank you for signing up",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
      res.send({
        message: "you're logged in!",
        user,
        token,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// add users/me
usersRouter.get("/me", async (req, res, next) => {
  console.log("A request is being made to users/me");
  const auth = req.header("Authorization");
  const prefix = "Bearer ";
  const token = auth.slice(prefix.length);
  const { id } = jwt.verify(token, JWT_SECRET);

  try {
    const user = await getUserById(id);
    const userOrders = await getOrdersByUser(user);
    const userCart = await getCartByUser(user);

    if (userOrders) {
      user.orders = userOrders;
    } else {
      user.orders = [];
    }

    if (userCart) {
      user.cart = userCart;
    } else {
      user.cart = [];
    }

    if (id == req.user.id) {
      res.send(user);
    }
    // }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.get("/:userId/orders", requireAdmin, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);
    if (user) {
      const orders = await getOrdersByUser(user);
      res.send(orders);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
