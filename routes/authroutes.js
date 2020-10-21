const express = require('express');
const authController = require('../controllers/authcontroller');
const isAuth = require('../middleware/is-auth');

const initRouter = () => {
    const router = express.Router();

    router.post('/login', authController.login);
    router.post('/updatePassword', isAuth, authController.updatePassword);
    return router;
}

module.exports = initRouter;