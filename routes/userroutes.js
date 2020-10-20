const express = require('express');
const isauth = require('../middleware/is-auth');
const userController = require('../controllers/usercontrollers');


const initRouter = () => {
    const router = express.Router();

    router.post('/createUser', isauth, userController.createUser);
    router.put('/updateUser', isauth, userController.updateUserDetails);
    router.delete('/deleteUser/:userId', isauth, userController.deleteUser);
    router.get('/users', isauth, userController.getUsers);
    router.get('/user/:userId', isauth, userController.getUser);
    return router;
}

module.exports = initRouter;