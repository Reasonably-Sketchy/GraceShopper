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
} = require('../db');
const bcrypt = require("bcrypt");

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
    console.error(error)
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
  };

  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
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

module.exports = usersRouter;
