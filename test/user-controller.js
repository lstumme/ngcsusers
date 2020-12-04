const { expect, assert } = require('chai');
const sinon = require('sinon');
const UserController = require('../controllers/usercontroller');
const UserServices = require('../services/userservices');

describe('User Controller', function () {
	describe('#createUser function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'createUser');
		});

		afterEach(function () {
			UserServices.createUser.restore();
		});

		it('should call next(err) if login is not specified', function (done) {
			const req = {
				body: {
					password: 'defaultPassword', 
					email: 'defaultEmail', 
					role: 'defaultRole', 
				}
			};
			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) if password is not specified', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					email: 'defaultEmail', 
					role: 'defaultRole', 
				}
			};
			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) if email is not specified', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					role: 'defaultRole', 
				}
			};
			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) if role is not specified', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					email: 'defaultEmail', 
				}
			};
			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});


		it('should return an object if User creation succeed', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					email: 'defaultEmail', 
					role: 'defaultRole', 
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

			UserServices.createUser.returns(new Promise((resolve, reject) => {
				resolve({ 
					userId: 'userIdValue',
					login: req.body.login, 
					password: req.body.password, 
					email: req.body.email, 
					role: req.body.role, 
				});
			}));

			UserController.createUser(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 201);
					expect(res.jsonObject).to.have.property('message', 'User created');
					expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
					expect(res.jsonObject.data).to.have.property('login', req.body.login); 
					expect(res.jsonObject.data).to.have.property('password', req.body.password); 
					expect(res.jsonObject.data).to.have.property('email', req.body.email); 
					expect(res.jsonObject.data).to.have.property('role', req.body.role); 
					done();				
				})
				.catch(err => {
					console.log(err);
				});		
		});
		
		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					email: 'defaultEmail', 
					role: 'defaultRole', 
				}
			};

			UserServices.createUser.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));
			
			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					login: 'defaultLogin', 
					password: 'defaultPassword', 
					email: 'defaultEmail', 
					role: 'defaultRole', 
				}
			};

			UserServices.createUser.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.createUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#updateUser function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'updateUser');
		});

		afterEach(function () {
			UserServices.updateUser.restore();
		});

		it('should call next(err) if no userId specified', function (done) {
			const req = {
				body: {
					firstname: 'firstname1', 
					lastname: 'lastname1', 
					avatar: 'avatar1', 
					role: 'role1', 
				}
			}

			let nextCalled = false;
			UserController.updateUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should return an object if update succeed', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					firstname: 'firstname1', 
					lastname: 'lastname1', 
					avatar: 'avatar1', 
					role: 'role1', 
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

			UserServices.updateUser.returns(new Promise((resolve, reject) => {
				resolve({ 
					userId: 'userIdValue',
					firstname: 'firstname1', 
					lastname: 'lastname1', 
					avatar: 'avatar1', 
					role: 'role1', 
				});
			}));

			UserController.updateUser(req, res, () => {})
				.then(() => {
					expect(res).to.have.property('statusCode', 201);
					expect(res.jsonObject).to.have.property('message', 'User updated');
					expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
					expect(res.jsonObject.data).to.have.property('firstname', req.body.firstname); 
					expect(res.jsonObject.data).to.have.property('lastname', req.body.lastname); 
					expect(res.jsonObject.data).to.have.property('avatar', req.body.avatar); 
					expect(res.jsonObject.data).to.have.property('role', req.body.role); 
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					firstname: 'firstname1', 
					lastname: 'lastname1', 
					avatar: 'avatar1', 
					role: 'role1', 
				}
			};

			UserServices.updateUser.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.updateUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					firstname: 'firstname1', 
					lastname: 'lastname1', 
					avatar: 'avatar1', 
					role: 'role1', 
				}
			};

			UserServices.updateUser.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.updateUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});


	describe('#deleteUser function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'deleteUser');
		});

		afterEach(function () {
			UserServices.deleteUser.restore();
		});

		it('should call next(err) if user is not specified', function (done) {
			const req = {
				body: {
				}
			};

			let nextCalled = false;
		   	UserController.deleteUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

	   it('should return a userId if User deletion succeed', function (done) {
			const req = {
				body: {
					userId: 'userId'
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

			UserServices.deleteUser.returns(new Promise((resolve, reject) => {
				resolve({ userId: req.body.userId });
			}));

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

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					userId: 'userId'
				}
			}

			UserServices.deleteUser.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				throw error;
			}));

			let nextCalled = false;
			UserController.deleteUser(req, {}, (err) => { 
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

	   	it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					userId: 'userId'
				}
			}

			UserServices.deleteUser.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.deleteUser(req, {}, (err) => { 
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#getUsers function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'getUsers');
		});

		afterEach(function () {
			UserServices.getUsers.restore();
		});

		it('should call next(err) if no page specified', function (done) {
			const req = {
				query: {
					perPage: '20',
				}
			}
			let nextCalled = false;
			UserController.getUsers(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) if no perPage specified', function (done) {
			const req = {
				query: {
					page: '1',
				}
			}

			let nextCalled = false;
			UserController.getUsers(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});


		it('should return an array if request succeed', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
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
			UserServices.getUsers.returns(new Promise((resolve, reject) => {
				resolve([
					{ userId: 'user1' },
					{ userId: 'user2' },
					{ userId: 'user3' },
				]);
			}));

			UserController.getUsers(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.lengthOf(3);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
				}
			}
			UserServices.getUsers.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.getUsers(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
				}
			}
			UserServices.getUsers.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.getUsers(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
				});
		});		
	});
	describe('#getUser function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'getUser');
		});

		afterEach(function () {
			UserServices.getUser.restore();
		});

		it('should call next(err) if no userId specified', function (done) {
			const req = {
				query: {
				}
			}
			let nextCalled = false;
			UserController.getUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					userId: 'abc',
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
			UserServices.getUser.returns(new Promise((resolve, reject) => {
				resolve({ userId: 'abc' });
			}));

			UserController.getUser(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('userId', 'abc');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					userId: 'abc',
				}
			}
			UserServices.getUser.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.getUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					userId: 'abc',
				}
			}
			UserServices.getUser.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.getUser(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#findUserByLogin function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'findUserByLogin');
		});

		afterEach(function () {
			UserServices.findUserByLogin.restore();
		});

		it('should call next(err) if login is not specified', function (done) {
			const req = {
				query: {
				}
			}

			let nextCalled = false;
			UserController.findUserByLogin(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					login: 'login1',
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
			UserServices.findUserByLogin.returns(new Promise((resolve, reject) => {
				resolve({ 
					userId: 'abc',
					login: 'login1', 
				});
			}));

			UserController.findUserByLogin(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('userId', 'abc');
					expect(res.jsonObject).to.have.property('login', 'login1');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					login: 'login1',
				}
			}
			UserServices.findUserByLogin.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.findUserByLogin(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					login: 'login1',
				}
			}
			UserServices.findUserByLogin.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.findUserByLogin(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#findUserByEmail function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'findUserByEmail');
		});

		afterEach(function () {
			UserServices.findUserByEmail.restore();
		});

		it('should call next(err) if email is not specified', function (done) {
			const req = {
				query: {
				}
			}

			let nextCalled = false;
			UserController.findUserByEmail(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					email: 'email1',
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
			UserServices.findUserByEmail.returns(new Promise((resolve, reject) => {
				resolve({ 
					userId: 'abc',
					email: 'email1', 
				});
			}));

			UserController.findUserByEmail(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('userId', 'abc');
					expect(res.jsonObject).to.have.property('email', 'email1');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					email: 'email1',
				}
			}
			UserServices.findUserByEmail.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.findUserByEmail(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					email: 'email1',
				}
			}
			UserServices.findUserByEmail.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.findUserByEmail(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});


	describe('#updateUserPassword function', function () {
		beforeEach(function () {
			sinon.stub(UserServices, 'updateUserPassword');
		});

		afterEach(function () {
			UserServices.updateUserPassword.restore();
		});

		it('should call next(err) if no userId specified', function (done) {
			const req = {
				body: {
					newPassword: 'password1', 
				}
			}

			let nextCalled = false;
			UserController.updateUserPassword(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) if no password specified', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
				}
			}

			let nextCalled = false;
			UserController.updateUserPassword(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should return an object if update succeed', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					newPassword: 'password1', 
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

			UserServices.updateUserPassword.returns(new Promise((resolve, reject) => {
				resolve({ 
					userId: 'userIdValue',
				});
			}));

			UserController.updateUserPassword(req, res, () => {})
				.then(() => {
					expect(res).to.have.property('statusCode', 201);
					expect(res.jsonObject).to.have.property('message', 'Password updated');
					expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					newPassword: 'password1', 
				}
			};

			UserServices.updateUserPassword.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			UserController.updateUserPassword(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					userId: 'userIdValue',
					newPassword: 'password1', 
				}
			};

			UserServices.updateUserPassword.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			UserController.updateUserPassword(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});

});
