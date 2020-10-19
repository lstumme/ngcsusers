const { expect, should } = require('chai');
const sinon = require('sinon');
const usercontroller = require('../controllers/usercontrollers');
const userservice = require('../services/userservice');

describe('User Controller', function () {
    describe("#getUser function", function () {
        beforeEach(function () {
            sinon.stub(userservice, 'getUser');
        });

        afterEach(function () {
            userservice.getUser.restore();
        });

        it('should throw an error if no userId specified', function (done) {
            const req = {
                body: {
                }
            }
            usercontroller.getUser(req, {}, () => { })
                .then(response => {
                    expect(true).to.be.false;
                    done();
                })
                .catch(err => {
                    expect(err).to.be.an('error').to.have.property('statusCode', 400);
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
            userservice.getUser.returns(new Promise((resolve, reject) => {
                resolve({ userId: 'abc' });
            }));

            usercontroller.getUser(req, res, () => { }).then(result => {
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
            userservice.getUser.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));
            let error = null;
            const next = (err) => {
                error = err;
            };
            usercontroller.getUser(req, {}, next).then(result => {
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
            userservice.getUser.returns(new Promise((resolve, reject) => {
                const error = new Error('Udefined Error');
                error.statusCode = 400;
                throw error;
            }));
            let error = null;
            const next = (err) => {
                error = err;
            }
            usercontroller.getUser(req, {}, next).then(result => {
                expect(error).to.not.be.null;
                expect(error).to.have.property('statusCode', 400);
                done();
            });
        });
    });
});
