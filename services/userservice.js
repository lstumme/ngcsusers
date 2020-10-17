const bcrypt = require('bcryptjs')
const User = require('../model/user');

exports.createUser = async ({ login, password, email }) => {
    return User.findOne({ login }).then(existingUser => {
        if (existingUser) {
            const error = new Error('User ${login} already exists');
            error.statusCode = 409;
            throw error;

        }
        return User.findOne({ email }).then(existingEmail => {
            if (existingEmail) {
                const error = new Error('A user with email ${email} already exists');
                error.statusCode = 409;
                throw error;
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({ login, email, password: hashedPassword });
                    return user.save();
                })
                .then(user => {
                    return { message: 'User created', userId: user._id };
                })

        })
    });
};

exports.deleteUser = async ({ userId }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        return user.remove();
    });
};

exports.updateUserDetails = async ({ userId, firstName, lastName, avatar }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (avatar) user.avatar = avatar;
        return user.save();
    });
};

exports.getUsers = async () => {
    return User.find();
};

exports.getUsers = async ({ userId }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        return user;
    });
};


