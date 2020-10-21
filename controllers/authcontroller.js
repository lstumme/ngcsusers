const { response } = require('express');
const authservices = require('../services/authservice');

exports.login = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    if (!login || !password) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        throw error;
    }
    return authservices.signin({ login, password })
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

exports.updatePassword = async (req, res, next) => {
    const userId = req.auth.userId;
    const password = req.body.password;
    if (!password) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        throw error;
    }
    return authservices.updatePassword({ userId, password })
        .then(success => {
            if (!success) {
                throw new Error('Server Error');
            }
            res.status(200).json();
            return success;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

