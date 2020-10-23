const express = require('express');
const isauth = require('../middleware/is-auth');
const userController = require('../controllers/usercontrollers');


const initRouter = () => {
    const router = express.Router();
    router.get('/user/:userId', isauth, userController.getUser);
    return router;
}

module.exports = initRouter;