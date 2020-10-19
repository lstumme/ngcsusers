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

