const express = require('express');
const authController = require('../controllers/authcontroller');

const initRouter = () => {
    const router = express.Router();

    router.post('/login', authController.login);
    return router;
}

module.exports = initRouter;