const userService = require('../services/userservice');

// exports.getUsers = (req, res, next) => {

// };

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

