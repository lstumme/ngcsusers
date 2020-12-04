const UserServices = require('../services/userservices');

exports.createUser = async (req, res, next) => {
	const login = req.body.login;
	const password = req.body.password;
	const email = req.body.email;
	const role = req.body.role;
	if (!login || !password || !email || !role) {
		const error = new Error('Bad arguments');
		error.statusCode = 400;
		next(error);
		return null;
	};

	return UserServices.createUser({ login, password, email, role })
		.then(response => {
			res.status(201).json({ message: 'User created', data: response });
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};


exports.updateUser = async (req, res, next) => {
	const userId = req.body.userId;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const avatar = req.body.avatar;
	const role = req.body.role;
	if (!userId) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);	
		return null;
	}

	return UserServices.updateUser({ userId, firstname, lastname, avatar, role})
        .then(response => {
            res.status(201).json({ message: 'User updated', data: response });
            return null;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
			return null;
        });
};


exports.deleteUser = async (req, res, next) => {
	const userId = req.body.userId;
	if (!userId) {
		const error = new Error('Bad arguments');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.deleteUser({ userId })
		.then(response => {
			res.status(200).json({ message: 'User deleted', data: response });
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};

exports.getUsers = async (req, res, next) => {
	const page = req.query.page;
	const perPage = req.query.perPage;
	if (!page || !perPage) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.getUsers({ page, perPage })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};

exports.getUser = async (req, res, next) => {
	const userId = req.query.userId;
	if (!userId) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.getUser({ userId })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};


exports.findUserByLogin = async (req, res, next) => {
	const login = req.query.login
	if (!login) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.findUserByLogin({ login: login })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};

exports.findUserByEmail = async (req, res, next) => {
	const email = req.query.email
	if (!email) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.findUserByEmail({ email: email })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};


exports.updateUserPassword = async (req, res, next) => {
	const userId = req.body.userId;
	const newPassword = req.body.newPassword;

	if (!userId || !newPassword) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return UserServices.updateUserPassword({ userId, newPassword })
		.then(response => {
			res.status(201).json({ message: 'Password updated', data: response });
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};


