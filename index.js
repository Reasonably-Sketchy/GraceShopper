// create the express server here
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const apiRouter = require('./api');
const client = require('./db/client');

const PORT = process.env.PORT || 3000;
const server = express();

// MIDDLEWARE
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors());

// ROUTERS
server.use('/api', apiRouter);

// ERROR HANDLING
// 404
server.use('*', (req, res, next) => {
    res.status(404);
    res.send({ error: 'Route not found' });
});

// 500
server.use((error, req, res, next) => {
    res.status(500);
    res.send(error);
});

server.listen(PORT, () => {
    client.connect();
    console.log(`Listening on port:`, PORT);
});