const { expect, should, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { ObjectId } = require('mongodb');
const { Role } = require('ngcsroles');
const UserServices = require('../services/userservices');
const User = require('../model/user');

describe('UserServices', function () {
	describe('#createUser function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});

		it('should throw an error if User with given login already exists', function (done) {
			const params = {
				login: 'defaultLogin',
				email: 'otherEmail',
				password: 'password',
				role: defaultRole._id.toString(),
			};

            UserServices.createUser(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `E11000 duplicate key error dup key: { : "${params.login}" }`);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should throw an error if User with given email already exists', function (done) {
			const params = {
				email: 'defaultEmail',
				login: 'otherLogin',
				password: 'password',
				role: defaultRole._id.toString(),
			};

            UserServices.createUser(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `E11000 duplicate key error dup key: { : "${params.email}" }`);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should create a User', function (done) {
			const params = {
				login: 'otherLogin',
				email: 'otherEmail',
				password: 'password',
				role: defaultRole._id.toString(),
			};
            UserServices.createUser(params)
                .then(result => {
					expect(result).to.have.ownProperty('userId');
					expect(result).to.have.property('login', params.login);
					expect(result).to.have.property('email', params.email);
					expect(result).to.have.property('role', params.role);
					done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('UserService Error');
					done();
                })
		});
	});

	describe('#updateUser function', function () {
				let defaultUser;
				let defaultRole;
		
		let otherRole;
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
			otherRole = Role({
				name: 'otherName',
				label: 'otherLabel',
			});
			otherRole = await otherRole.save();
			

		});

		it('should throw an error if User to update is not found', function (done) {
			const params = {
				firstname: 'newFirstname',
				lastname: 'newLastname',
				avatar: 'newAvatar',
				role: 'newRole',
			};
			UserServices.updateUser(params)
				.then(result => {
					assert.fail('updateUser error');
					done();
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find user.');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should update User firstname if firstname is provided', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				firstname: 'newFirstname',
			};

			UserServices.updateUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					expect(result).to.have.property('firstname', params.firstname);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});	

		it('should update User lastname if lastname is provided', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				lastname: 'newLastname',
			};

			UserServices.updateUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					expect(result).to.have.property('lastname', params.lastname);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});	

		it('should update User avatar if avatar is provided', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				avatar: 'newAvatar',
			};

			UserServices.updateUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					expect(result).to.have.property('avatar', params.avatar);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});	

		it('should update User role if role is provided', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				role: otherRole._id.toString(),
			};

			UserServices.updateUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					expect(result).to.have.property('role', params.role);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});	

		it('should update User properties if everything is provided', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				firstname: 'newFirstname',
				lastname: 'newLastname',
				avatar: 'newAvatar',
				role: otherRole._id.toString(),
			};

			UserServices.updateUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					expect(result).to.have.property('firstname', params.firstname);
					expect(result).to.have.property('lastname', params.lastname);
					expect(result).to.have.property('avatar', params.avatar);
					expect(result).to.have.property('role', params.role);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

	describe('#deleteUser function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});

		it('should throw an error if User to delete is not found', function (done) {
			const params = {
				userId: ObjectId().toString(),
			};
			UserServices.deleteUser(params)
				.then(result => {
					assert.fail('deleteUser error');
					done();
				})
				.catch(err => {
					expect(err).to.have.property('message', 'User to delete was not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should delete User if User exists', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
			};
			UserServices.deleteUser(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});		
	});

	describe('#getUsers function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			
			for (let i = 0; i < 20; i++) {
				const user = new User({
					login: 'Login_' + i,
					password: 'Password_' + i,
					email: 'Email_' + i,
					role: defaultRole._id.toString(),
				});
				await user.save();
			}			
		});

		it('should throw an error if range out of bounds', function (done) {
            UserServices.getUsers({ page: '3', perPage: '10' })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Pagination out of bounds.');
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object containing the required data and the number if pages', function (done) {
            const perPage = '10';
            UserServices.getUsers({ page: 1, perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 2);
                    expect(result).to.have.property('users').to.have.lengthOf(perPage);
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })			
		});

        it('should return an object containing the required data and the number of pages 2', function (done) {
            const perPage = '7';
            UserServices.getUsers({ page: '1', perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 3);
                    expect(result).to.have.property('users').to.have.lengthOf(perPage);
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });
	});

	describe('#getUser function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});
	
		it('should throw an error if User not found', function (done) {
			UserServices.getUser({ userId: ObjectId().toString() })
				.then(result => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('statusCode', 404);
					expect(err).to.have.property('message', 'User not found');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should return an object if User found', function (done) {
			UserServices.getUser({ userId: defaultUser._id.toString() })
				.then(result => {
					expect(result).to.have.property('userId', defaultUser._id.toString());
					expect(result).to.have.property('login', defaultUser.login);
					expect(result).to.have.property('email', defaultUser.email);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});
	});

	describe('#findUserByLogin function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});

		it('should throw an error if User is not found', function (done) {
			const params = {
				login: 'otherUserLogin',
			};
			UserServices.findUserByLogin(params)
				.then(user => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find User');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object if User is found', function (done) {
			const params = {
				login: defaultUser.login,
			};
			UserServices.findUserByLogin(params)
				.then(user => {
					expect(user).not.to.be.null;
					expect(user).to.have.property('userId', defaultUser._id.toString());
					expect(user).to.have.property('login', defaultUser.login);
					expect(user).to.have.property('email', defaultUser.email);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

	describe('#findUserByEmail function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});

		it('should throw an error if User is not found', function (done) {
			const params = {
				email: 'otherUserEmail',
			};
			UserServices.findUserByEmail(params)
				.then(user => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find User');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object if User is found', function (done) {
			const params = {
				email: defaultUser.email,
			};
			UserServices.findUserByEmail(params)
				.then(user => {
					expect(user).not.to.be.null;
					expect(user).to.have.property('userId', defaultUser._id.toString());
					expect(user).to.have.property('login', defaultUser.login);
					expect(user).to.have.property('email', defaultUser.email);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});



	describe('#updateUserPassword function', function () {
				let defaultUser;
				let defaultRole;
		
		before(async () => {
			await dbHandler.connect();
			await User.createIndexes();
		});
		
		after(async () => {
			await dbHandler.closeDatabase();
		});
		
		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		
		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
			
			
			defaultUser = User({
				login: 'defaultLogin',
				password: 'defaultPassword',
				email: 'defaultEmail',
				role: defaultRole._id.toString(),
			});
			defaultUser = await defaultUser.save();
			
		});

		it('should throw an error if User to delete is not found', function (done) {
			const params = {
				newPassword: 'newPassword',
			};
			UserServices.updateUserPassword(params)
				.then(result => {
					assert.fail('updateUserPassword error');
					done();
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find user.');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should update password if User exists', function (done) {
			const params = {
				userId: defaultUser._id.toString(),
				newPassword: 'newPassword',
			};

			UserServices.updateUserPassword(params)
				.then(result => {
					expect(result).to.have.property('userId', params.userId);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});		
	});


});
