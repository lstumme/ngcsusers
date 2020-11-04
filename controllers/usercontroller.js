const userServices = require('../services/userservices');

exports.createUser = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;
    if (!login || !password || !email) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        throw error;
    }
    return userServices.createUser({ login, password, email })
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
        throw error;
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
    if (!userId ) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        throw error;
    }
    return userServices.updateUserDetails({ userId, firstname, lastname, avatar })
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
    const page = req.body.page;
    const perPage = req.body.perPage;
    if (!page || !perPage) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        throw error;
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
        throw error;
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

