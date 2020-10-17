const authcontroller = require('../controllers/authcontroller');

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    const userId = authcontroller.decodeToken(token);
    req.userId = userId;
    next();
};