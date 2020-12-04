const { expect, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { Role } = require('ngcsroles');
const UserController = require('../controllers/usercontroller');
const User = require('../model/user');

describe('User Integration', function () {
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
			
			
			
		});
		
		it('should return an object if User creation succeed', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					email: 'defaultEmail', 
					role: defaultRole._id.toString(), 
				}
			};

            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

			UserController.createUser(req, res, () => { })
				.then(() => {
	                expect(res).to.have.property('statusCode', 201);
	                expect(res.jsonObject).to.have.property('message', 'User created');
	                expect(res.jsonObject.data).to.have.ownProperty('userId');
					expect(res.jsonObject.data).to.have.property('login', req.body.login); 
					expect(res.jsonObject.data).to.have.property('email', req.body.email); 
					expect(res.jsonObject.data).to.have.property('role', req.body.role); 
					done();				
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});		
		});
	});
	describe('#updateUser function', function () {
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

       it('should return a userId if User deletion succeed', function (done) {
            const req = {
                body: {
                    userId: defaultUser._id.toString(),
                }
            }
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

            UserController.deleteUser(req, res, () => { })
				.then(result => {
	                expect(res).to.have.property('statusCode', 200);
	                expect(res.jsonObject).to.have.property('message', 'User deleted');
	                expect(res.jsonObject.data).to.have.property('userId', req.body.userId)
	                done();
            	})
				.catch(err => {
					console.log(err);
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

        it('should return an array if request succeed', function (done) {
            const req = {
                query: {
					page: '1',
                    perPage: '10'
                }
            }
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

            UserController.getUsers(req, res, () => { })
				.then(result => {
	                expect(res).to.have.property('statusCode', 200);
	                expect(res.jsonObject.users).to.have.lengthOf(10);
	                done();
	            })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
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

        it('should return an object if request succeed', function (done) {
            const req = {
                query: {
                    userId: defaultUser._id.toString(),
                }
            }
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

            UserController.getUser(req, res, () => { })
				.then(result => {
	                expect(res).to.have.property('statusCode', 200);
	                expect(res.jsonObject).to.have.property('userId', defaultUser._id.toString());
	                done();
	            })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
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

        it('should return an object if request succeed', function (done) {
            const req = {
                query: {
					login: 'defaultLogin',
                }
            }
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

            UserController.findUserByLogin(req, res, () => { })
				.then(result => {
	                expect(res).to.have.property('statusCode', 200);
	                expect(res.jsonObject).to.have.property('userId', defaultUser._id.toString());
					expect(res.jsonObject).to.have.property('login', 'defaultLogin');
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

        it('should return an object if request succeed', function (done) {
            const req = {
                query: {
					email: 'defaultEmail',
                }
            }
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };

            UserController.findUserByEmail(req, res, () => { })
				.then(result => {
	                expect(res).to.have.property('statusCode', 200);
	                expect(res.jsonObject).to.have.property('userId', defaultUser._id.toString());
					expect(res.jsonObject).to.have.property('email', 'defaultEmail');
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
