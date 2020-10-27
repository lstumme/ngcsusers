const { expect, should, assert } = require('chai');
const sinon = require('sinon');
const userController = require('../controllers/usercontroller');
const userServices = require('../services/userservices');

describe('User Controller', function () {
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
                body: {
                    perPage: 20
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
                body: {
                    page: 1
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
                body: {
                    page: 1,
                    perPage: 10
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
                body: {
                    page: 1,
                    perPage: 10
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
                body: {
                    page: 1,
                    perPage: 10
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
