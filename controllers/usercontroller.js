const userService = require('../services/userservices');

exports.getUsers = async (req, res, next) => {
    const page = req.body.page;
    const perPage = req.body.perPage;
    if (!page || !perPage) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        throw error;
    }
    return userService.getUsers({ page, perPage })
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

    return userService.getUser({ userId })
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

