const express = require('express');
const healthRouter = express.Router();

healthRouter.get('/', async (req, res, next) => {
    res.send({
        name: 'Heartbeat',
        message: 'The API is healthy.'
    });
});

module.exports = healthRouter;