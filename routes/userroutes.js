const express = require('express');
const userController = require('../controllers/usercontrollers');

const router = express.Router();

router.post('/createUser', userController.createUser);
router.put('/updateUser', userController.updateUserDetails);
router.delete('/deleteUser/:userId', userController.deleteUser);
router.get('/users', userController.getUsers);
router.get('/user/:userId', userController.getUser);

module.exports = router;