const authServices = require('../services/authservices');

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization');
    if (!authorization) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1];
    const userId = authServices.decodeToken(token);
    req.auth = { userId: userId };
    next();
};