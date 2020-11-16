const userServices = require('../services/userservices');

exports.createUser = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    if (!login || !password || !email || !role) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);
    }
    return userServices.createUser({ login, password, email, role })
        .then(response => {
            res.status(201).json({ message: 'User created', data: response });
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.body.userId;
    if (!userId) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);
    }
    return userServices.deleteUser({ userId })
        .then(response => {
            res.status(200).json({ message: 'User deleted', data: response });
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserDetails = async (req, res, next) => {
    const userId = req.body.userId;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const avatar = req.body.avatar;
    const role = req.body.role;
    if (!userId) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);
    }
    return userServices.updateUserDetails({ userId, firstname, lastname, avatar, role })
        .then(response => {
            res.status(200).json({ message: 'User updated', data: response });
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUsers = async (req, res, next) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    if (!page || !perPage) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
    }
    return userServices.getUsers({ page, perPage })
        .then(response => {
            res.status(200).json(response);
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUser = async (req, res, next) => {
    const userId = req.body.userId;
    if (!userId) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
    }

    return userServices.getUser({ userId })
        .then(response => {
            res.status(200).json({ ...response });
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

