const express = require('express');
const isauth = require('../middleware/is-auth');
const userController = require('../controllers/usercontroller');


const initRouter = () => {
    const router = express.Router();
    router.get('/user/:userId', isauth, userController.getUser);
    router.get('/users', isauth, userController.getUsers);
    return router;
}

module.exports = initRouter;