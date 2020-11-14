const authServices = require('../services/authservices');

exports.login = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    if (!login || !password) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
    }
    return authServices.signin({ login, password })
        .then(response => {
            res.status(200).json({ message: 'Access granted', data: response });
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
        next(error);
    }
    return authServices.updatePassword({ userId, password })
        .then(success => {
            if (!success) {
                throw new Error('Server Error');
            }
            res.status(200).json({ message: 'Password updated' });
            return true;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

