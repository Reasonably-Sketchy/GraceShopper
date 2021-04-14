const { createSecureServer } = require("http2");
const client = require(`./client`);
const bcrypt = require('bcrypt');

async function createUser({ first, last, email, username, password, imageURL, isAdmin }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
                INSERT INTO users(first, last, email, username, password, "imageURL", "isAdmin")
                VALUES($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (email) DO NOTHING
                RETURNING *;
            `,
      [first, last, email, username, hashedPassword, imageURL, isAdmin]
    );

    if (!user.isAdmin) {
      delete user.isAdmin;
    };

    if (user.password) {
      delete user.password;
    };
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
    // console.log('user line 39', user)
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);


    if (!passwordsMatch) {
      // return the user object (without the password)
      return;
    }

    if (!user.isAdmin) {
      delete user.isAdmin
    };

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

    if (!user.isAdmin) {
      delete user.isAdmin;
    };
    
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
    console.log('user line 98 in db/users.js ', user)
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
    console.log('users line 111', users )
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
