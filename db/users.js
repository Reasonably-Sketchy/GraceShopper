const { createSecureServer } = require("http2");
const client = require(`./client`);
const bcrypt = require('bcrypt');

async function createUser({ first, last, email, username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                INSERT INTO users(first, last, email, username, password)
                VALUES($1, $2, $3, $4, $5)
                ON CONFLICT (email) DO NOTHING
                RETURNING *;
            `,
      [first, last, email, username, hashedPassword]
    );
    if (user.password) {
      delete user.password;
    }
    console.log('USER: ', user)
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  // add some validation
  try {
    const user = await getUserByUserName(username);
    // const user = await getUserByUserName(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);


    if (!passwordsMatch) {
      // return the user object (without the password)
      return;
    }
    delete user.password;
    return user;
  } catch (error) {
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
    };
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

async function getAllUsers() {
  try {
    const {rows: [users]} = await client.query(`
      SELECT *
      FROM users;
    `);

    return users;
  } catch (error) {
    throw error;
  };
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
  getAllUsers,
};
