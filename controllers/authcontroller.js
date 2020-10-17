const authservices = require('../services/authservice');

exports.login = (req, res, next) => {
    const login = req.login;
    const password = req.password;
    authservices.signin({ login, password })
        .then(response => {
            res.status(200).json({ ...response });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

