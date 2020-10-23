const User = require('../model/user');


exports.getUsers = async ({ page, perPage }) => {
    return User.countDocuments()
        .then(count => {
            const pageCount = Math.trunc(count / perPage) + (count % perPage > 0 ? 1 : 0);
            if (count <= perPage * (page - 1) || (perPage * (page - 1) < 0)) {
                const error = new Error('Pagination out of bounds.');
                error.statusCode = 400;
                throw error;
            }
            return User.find().skip((page - 1) * perPage).limit(perPage)
                .select('login firstname lastname email avatar')
                .then(result => {
                    return {
                        users: result,
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
            return user;
        });
};


