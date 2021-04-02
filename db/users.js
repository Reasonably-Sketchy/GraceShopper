const { createSecureServer } = require("http2");
const client = require(`./client`);
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                INSERT INTO users(username, password)
                VALUES($1, $2)
                ON CONFLICT (username) DO NOTHING
                RETURNING *;
            `,
      [username, hashedPassword]
    );
    if (user.password) {
      delete user.password;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUserName(username);
    // const user = await getUserByUserName(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      // return the user object (without the password)
      delete user.password;
      return user;
    }
  } catch (user) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                SELECT *
                FROM users
                WHERE id=$1;
            `,
      [id]
    );
    if (user.password) {
      delete user.password;
    }
    return user;
  } catch (user) {
    throw error;
  }
}

async function getUserByUserName(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                SELECT *
                FROM users
                WHERE username=$1;
            `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
};
