const User = require('../model/user');


// exports.getUsers = async () => {
//     return User.find();
// };

exports.getUser = async ({ userId }) => {
    console.log(userId);
    return User.findOne({ _id: userId }).then(user => {
        console.log(user);
        if (!user) {
            const error = new Error('User not found.')
            error.statusCode = 404;
            throw error;
        }
        return user;
    });
};


