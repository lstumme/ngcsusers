const { expect, should, assert } = require('chai');
const sinon = require('sinon');
const userController = require('../controllers/usercontroller');
const userServices = require('../services/userservices');

describe('User Controller', function () {
    describe("#createUser function", function () {
        beforeEach(function () {
            sinon.stub(userServices, 'createUser');
        });

        afterEach(function () {
            userServices.createUser.restore();
        });

        it('should throw an error if login is not specified', function (done) {
            const req = {
                body: {
                    password: 'password',
                    email: 'email'
                }
            }
            userController.createUser(req, {}, () => { })
                .then(response => {
                    assert.fail('createUser error');
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });
        it('should throw an error if password is not specified', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    email: 'email'
                }
            }
            userController.createUser(req, {}, () => { })
                .then(response => {
                    assert.fail('createUser Error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should throw an error if email is not specified', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password',
                }
            }

            userController.createUser(req, {}, () => { })
                .then(response => {
                    assert.failt('createUser error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should return an object if user creation succeed', function (done) {
            req = {
                body: {
                    login: 'userlogin',
                    password: 'password',
                    email: 'email'
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
            userServices.createUser.returns(new Promise((resolve, reject) => {
                resolve({ userId: 'userIdValue', userData: 'userData' });
            }));

            userController.createUser(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 201);
                expect(res.jsonObject).to.have.property('message', 'User created');
                expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
                expect(res.jsonObject.data).to.have.property('userData', 'userData');
                done();
            });
        });

        it('should call next(err) adding default statusCode if not specified', function (done) {
            req = {
                body: {
                    login: 'userlogin',
                    password: 'password',
                    email: 'email'
                }
            };
            userServices.createUser.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            userController.createUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            req = {
                body: {
                    login: 'userlogin',
                    password: 'password',
                    email: 'email'
                }
            };
            userServices.createUser.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            userController.createUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });

    describe("#deleteUser function", function () {
        beforeEach(function () {
            sinon.stub(userServices, 'deleteUser');
        });

        afterEach(function () {
            userServices.deleteUser.restore();
        });

        it('should throw an error if userId is not specified', function (done) {
            const req = {
                body: {
                }
            }

            userController.deleteUser(req, {}, () => { })
                .then(response => {
                    assert.fail('deleteUser error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should return an object if user deletion succeed', function (done) {
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
            userServices.deleteUser.returns(new Promise((resolve, reject) => {
                resolve({ userId: req.body.userId });
            }));

            userController.deleteUser(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'User deleted');
                expect(res.jsonObject.data).to.have.property('userId', req.body.userId)
                done();
            });
        });

        it('should call next(err) adding default statusCode if not specified', function (done) {
            const req = {
                body: {
                    userId: 'userId'
                }
            }
            userServices.deleteUser.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            userController.deleteUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                body: {
                    userId: 'userId'
                }
            }
            userServices.deleteUser.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            userController.deleteUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });

    describe("#updateUserDetails function", function () {
        beforeEach(function () {
            sinon.stub(userServices, 'updateUserDetails');
        });

        afterEach(function () {
            userServices.updateUserDetails.restore();
        });

        it('should throw an error if no userId specified', function (done) {
            const req = {
                body: {
                    firstame: 'firstName',
                    lastname: 'lastName',
                    avatar: null
                }
            }
            userController.updateUserDetails(req, {}, () => { })
                .then(response => {
                    assert.fail('updateUserDetails error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should return an object if update succeed', function (done) {
            const req = {
                body: {
                    userId: 'abc',
                    firstame: 'firstName',
                    lastname: 'lastName',
                    avatar: null
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
            userServices.updateUserDetails.returns(new Promise((resolve, reject) => {
                resolve({ userId: 'abc' });
            }));

            userController.updateUserDetails(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'User updated');
                expect(res.jsonObject.data).to.have.property('userId', 'abc');
                done();
            });
        });

        it('should call next(err) adding default statusCode if not specified', function (done) {
            const req = {
                body: {
                    userId: 'abc',
                    firstame: 'firstName',
                    lastname: 'lastName',
                    avatar: null
                }
            }
            userServices.updateUserDetails.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            userController.updateUserDetails(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                body: {
                    userId: 'abc',
                    firstame: 'firstName',
                    lastname: 'lastName',
                    avatar: null
                }
            }
            userServices.updateUserDetails.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            userController.updateUserDetails(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });

    describe("#getUser function", function () {
        beforeEach(function () {
            sinon.stub(userServices, 'getUser');
        });

        afterEach(function () {
            userServices.getUser.restore();
        });

        it('should throw an error if no userId specified', function (done) {
            const req = {
                body: {
                }
            }
            userController.getUser(req, {}, () => { })
                .then(response => {
                    assert.fail('Test process Error');
                    done();
                })
                .catch(err => {
                    expect(err).to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should return an object if request succeed', function (done) {
            const req = {
                body: {
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
            userServices.getUser.returns(new Promise((resolve, reject) => {
                resolve({ userId: 'abc' });
            }));

            userController.getUser(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('userId', 'abc');
                done();
            });
        });

        it('should call next(err) adding default statusCode if not specified', function (done) {
            const req = {
                body: {
                    userId: 'abc',
                }
            }
            userServices.getUser.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            userController.getUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                body: {
                    userId: 'abc',
                }
            }
            userServices.getUser.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            userController.getUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });

    describe("#getUsers function", function () {
        beforeEach(function () {
            sinon.stub(userServices, 'getUsers');
        });

        afterEach(function () {
            userServices.getUsers.restore();
        });

        it('should throw an error if no page specified', function (done) {
            const req = {
                query: {
                    perPage: '20'
                }
            }
            userController.getUsers(req, {}, () => { })
                .then(response => {
                    assert.fail('Test process Error');
                    done();
                })
                .catch(err => {
                    expect(err).to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should throw an error if no perPage specified', function (done) {
            const req = {
                query: {
                    page: '1'
                }
            }
            userController.getUsers(req, {}, () => { })
                .then(response => {
                    assert.fail('Test process Error');
                    done();
                })
                .catch(err => {
                    expect(err).to.have.property('statusCode', 400);
                    done();
                });
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
            userServices.getUsers.returns(new Promise((resolve, reject) => {
                resolve([
                    { userId: 'user1' },
                    { userId: 'user2' },
                    { userId: 'user3' },
                ]);
            }));

            userController.getUsers(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.lengthOf(3);
                done();
            });
        });

        it('should call next(err) adding default statusCode if not specified', function (done) {
            const req = {
                query: {
                    page: '1',
                    perPage: '10'
                }
            }
            userServices.getUsers.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            userController.getUsers(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                query: {
                    page: '1',
                    perPage: '10'
                }
            }
            userServices.getUsers.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            userController.getUsers(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });

    });
});
