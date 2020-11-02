const { expect, assert } = require('chai');
const sinon = require('sinon');

const authcontroller = require('../controllers/authcontroller');
const { login } = require('../controllers/authcontroller');
const authServices = require('../services/authservices');

describe('Auth Controller', function () {
    describe('#login function', function () {
        beforeEach(function () {
            sinon.stub(authServices, 'signin');
        });

        afterEach(function () {
            authServices.signin.restore();
        });

        it('should throw an error if login is not specified', function (done) {
            const req = {
                body: {
                    password: 'password'
                }
            }
            authcontroller.login(req, {}, () => { })
                .then(response => {
                    assert.fail('login error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should throw an error if login is not specified', function (done) {
            const req = {
                body: {
                    login: 'login'
                }
            }
            authcontroller.login(req, {}, () => { })
                .then(response => {
                    assert.fail('login error');
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should return signin objet response ', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
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
            authServices.signin.returns(new Promise((resolve, reject) => {
                resolve({ token: 'tokenValue', userId: 'userIdValue' });
            }));
            authcontroller.login(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Access granted');
                expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
                expect(res.jsonObject.data).to.have.property('token', 'tokenValue');
                done();
            });
        });

        it('should call next(err) adding default statusCode on process error', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            authServices.signin.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            authcontroller.login(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            authServices.signin.returns(new Promise((resolve, reject) => {
                const error = new Error('Undefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            authcontroller.login(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });

    describe('#updatePassword function', function () {
        beforeEach(function () {
            sinon.stub(authServices, 'updatePassword');
        });

        afterEach(function () {
            authServices.updatePassword.restore();
        });

        it('should throw an error if password is not specified', function (done) {
            const req = {
                auth: {
                    userId: 'abcd'
                },
                body: {}
            }
            authcontroller.updatePassword(req, {}, () => { })
                .then(response => {
                    assert.fail('updatePassword failed');
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
                    done();
                });
        });

        it('should call next(err) adding default statusCode on process error', function (done) {
            const req = {
                auth: {
                    userId: 'abcd'
                },
                body: {
                    password: 'newpassword'
                }
            };
            authServices.updatePassword.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            authcontroller.updatePassword(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                auth: {
                    userId: 'abcd'
                },
                body: {
                    password: 'newpassword'
                }
            };
            authServices.updatePassword.returns(new Promise((resolve, reject) => {
                const error = new Error('Undefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            authcontroller.updatePassword(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });

        it('should raise an error if process failed', function (done) {
            const req = {
                auth: {
                    userId: 'abcd'
                },
                body: {
                    password: 'newpassword'
                }
            };
            authServices.updatePassword.returns(new Promise((resolve, reject) => {
                resolve(false);
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            authcontroller.updatePassword(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('message', 'Server Error')
                expect(error).to.have.property('statusCode', 500);
                done();
            });
        });

        it('should return success ', function (done) {
            const req = {
                auth: {
                    userId: 'abcd'
                },
                body: {
                    password: 'newpassword'
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
            authServices.updatePassword.returns(new Promise((resolve, reject) => {
                resolve(true);
            }));
            authcontroller.updatePassword(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Password updated');
                expect(result).to.be.true;
                done();
            });
        });

    });
});