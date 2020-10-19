const bcrypt = require('bcryptjs')
const User = require('../model/user');


// exports.getUsers = async () => {
//     return User.find();
// };

exports.getUser = async ({ userId }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        return user;
    });
};


