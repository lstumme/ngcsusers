const bcrypt = require('bcryptjs');
const { Role } = require('ngcsroles');
const User = require('../model/user');

const convertUser2Object = u => {
	return {
		userId: u._id.toString(),
		login: u.login,
		email: u.email,
		firstname: u.firstname,
		lastname: u.lastname,
		avatar: u.avatar,
		role: u.role.toString(),
	};
};

exports.createUser = async ({ login, password, email, role }) => {
	const hashedPassword = await bcrypt.hash(password, 12);
	const user = new User({
		login: login,
		email: email,
		password: hashedPassword,
		role: role,
	});
	return user.save().then(u => {
		return convertUser2Object(u);
	});
};

exports.updateUser =  async ({ userId, firstname, lastname, avatar, role}) => {    
	return User.findOne({ _id: userId,  }).then(user => {
        if (!user) {
            const error = new Error('Could not find user.')
            error.statusCode = 404;
            throw error;
        }

		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (avatar) user.avatar = avatar;
		if (role) user.role = role;

		return user.save().then(u => {
			return convertUser2Object(u);
		});
	});
};


exports.deleteUser = async ({ userId }) => {
	return User.exists({ _id: userId })
		.then(result => {
			if (!result) {
				const error = new Error('User to delete was not found');
				error.statusCode = 404;
				throw error;
			}
			return result;
		})
		.then(() => {
			return User.deleteOne({ _id: userId })
				.then(() => {
					return { userId };
				})
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
		.then(user => {
			if (!user) {
				const error = new Error('User not found');
				error.statusCode = 404;
				throw error;
			}
			return convertUser2Object(user);
		})
};


exports.findUserByLogin = async ({ login }) => {
	return User.findOne({ login: login })
		.then(user => {
			if (!user) {
				const error = new Error('Could not find User');
				error.statusCode = 404;
				throw error;
			}
			return convertUser2Object(user);
		});
};

exports.findUserByEmail = async ({ email }) => {
	return User.findOne({ email: email })
		.then(user => {
			if (!user) {
				const error = new Error('Could not find User');
				error.statusCode = 404;
				throw error;
			}
			return convertUser2Object(user);
		});
};


exports.updateUserPassword = async ({ userId, newPassword }) => { 
	const hashedPassword = await bcrypt.hash(newPassword, 12);
	return User.findOne({ _id: userId })
		.then(user => {
	        if (!user) {
	            const error = new Error('Could not find user.')
	            error.statusCode = 404;
	            throw error;
	        }
			user.password = hashedPassword;
			return user.save().then(u => {
				return convertUser2Object(u);
			});
		})
};


