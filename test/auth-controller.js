const { expect, should } = require('chai');
const sinon = require('sinon');

const authcontroller = require('../controllers/authcontroller');
const { login } = require('../controllers/authcontroller');
const authservice = require('../services/authservice');

describe('Auth Controller', function () {
    describe('#login function', function () {
        beforeEach(function () {
            sinon.stub(authservice, 'signin');
        });

        afterEach(function () {
            authservice.signin.restore();
        });

        it('should throw an error if login is not specified', function (done) {
            const req = {
                body: {
                    password: 'password'
                }
            }
            authcontroller.login(req, {}, () => { })
                .then(response => {
                    expect(true).to.be.false;
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
                    expect(true).to.be.false;
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
            authservice.signin.returns(new Promise((resolve, reject) => {
                resolve({ token: 'tokenValue', userId: 'userIdValue' });
            }));
            authcontroller.login(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('userId', 'userIdValue');
                expect(res.jsonObject).to.have.property('token', 'tokenValue');
                done();
            });
        });

        it('should call next(err) adding default statusCode', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            authservice.signin.returns(new Promise((resolve, reject) => {
                throw new Error('Udefined Error');
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
            authservice.signin.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
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
});