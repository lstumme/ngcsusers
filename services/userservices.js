const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { Role } = require('ngcsroles');

const convertUser2Object = u => {
    return {
        userId: u._id.toString(),
        login: u.login,
        email: u.email,
        firstname: u.firstname,
        lastname: u.lastname,
        avatar: u.avatar,
        role: u.role.toString()
    }
}


exports.createUser = async ({ login, password, email, role }) => {
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
                    const user = new User({ login, email, password: hashedPassword, role: role });
                    return user.save().then(u => {
                        return convertUser2Object(u);
                    });
                })
        })
    })
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

exports.updateUserDetails = async ({ userId, firstname, lastname, avatar, role }) => {
    return User.findOne({ _id: userId }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (avatar) user.avatar = avatar;
        if (role) user.role = role;
        return user.save()
            .then(u => {
                return convertUser2Object(u);
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
                    return {
                        users: result.map(u => { return convertUser2Object(u); }),
                        pageCount: pageCount
                    };
                })
        });
};

exports.getUser = async ({ userId }) => {
    return User.findOne({ _id: userId })
        .select('login firstname lastname email avatar role')
        .then(user => {
            if (!user) {
                const error = new Error('User not found.')
                error.statusCode = 404;
                throw error;
            }
            return convertUser2Object(user);
        });
};


exports.findUser = async ({ login }) => {
    return User.findOne({ login: login })
        .then(user => {
            return user ? convertUser2Object(user) : user;
        })
}

