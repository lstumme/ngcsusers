const User = require('../model/user');
const bcrypt = require('bcryptjs');

exports.createUser = async ({ login, password, email }) => {
    return User.findOne({ login }).then(existingUser => {
        if (existingUser) {
            const error = new Error(`User ${login} already exists`);
            error.statusCode = 409;
            throw error;

        }
        return User.findOne({ email }).then(existingEmail => {
            if (existingEmail) {
                const error = new Error(`A user with email ${email} already exists`);
                error.statusCode = 409;
                throw error;
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({ login, email, password: hashedPassword });
                    return user.save().then(u => {
                        return {
                            userId: u._id.toString(),
                            email: u.email,
                            login: u.login
                        };
                    });
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
        return user.remove()
            .then(u => {
                return { userId: u._id.toString() };
            })
    });
};

exports.updateUserDetails = async ({ userId, firstname, lastname, avatar }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (avatar) user.avatar = avatar;
        return user.save()
            .then(u => {
                return {
                    userId: u._id.toString(),
                    login: u.login,
                    email: u.email,
                    firstname: u.firstname,
                    lastname: u.lastname,
                    avatar: u.avatar
                }
            });
    });
};

exports.getUsers = async ({ page, perPage }) => {
    return User.countDocuments()
        .then(count => {
            const pageCount = Math.trunc(count / perPage) + (count % perPage > 0 ? 1 : 0);
            if (count <= perPage * (page - 1) || (perPage * (page - 1) < 0)) {
                const error = new Error('Pagination out of bounds.');
                error.statusCode = 400;
                throw error;
            }
            return User.find().skip((page - 1) * perPage).limit(Number.parseInt(perPage))
                .then(result => {
                    const res = [];
                    for (let i = 0; i < result.length; i++) {
                        const u = result[i];
                        res.push({
                            userId: u._id.toString(),
                            login: u.login,
                            email: u.email,
                            firstname: u.firstname,
                            lastname: u.lastname,
                            avatar: u.avatar
                        })
                    }

                    return {
                        users: res,
                        pageCount: pageCount
                    };
                })
        });
};

exports.getUser = async ({ userId }) => {
    return User.findOne({ _id: userId })
        .select('login firstname lastname email avatar')
        .then(user => {
            if (!user) {
                const error = new Error('User not found.')
                error.statusCode = 404;
                throw error;
            }
            return {
                userId: user._id.toString(),
                login: user.login,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar
            };
        });
};


