const userService = require('../services/userservice');

exports.createUser = (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;
    userService.createUser({ login, password, email })
        .then(user => {
            res.status(201).json({ ...user, password: null });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUser = (req, res, next) => {
    const userId = req.password.userId;
    userService.deleteUser({ userId })
        .then(user => {
            res.status(201).json({ ...user, password: null });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserDetails = (req, res, next) => {
    const userId = req.body.userId;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const avatar = req.body.avatar;
    userService.updateUserDetails({ userId, firstName, lastName, avatar })
        .then(user => {
            res.status(201).json({ ...user, password: null });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUsers = (req, res, next) => {

};

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    userService.getUser({ userId })
        .then(user => {
            res.status(201).json({ ...user, password: null });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

};

