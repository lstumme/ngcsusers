const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const User = require('../model/user');

const secretpassword = 'secretPassword';

exports.signin = async ({ login, password }) => {
    let loadedUser;
    User.findOne({ login })
        .then(user => {
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 401;   // not authenticated
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong password");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({ login: login, userId: loadedUser._id.toString() }, secretpassword, { expiresIn: '1h' });
            return { token: token, userId: loadedUser._id.toString() };
        })
};

exports.decodeToken = ({ token }) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, secretpassword);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    return decodedToken.userId;
};