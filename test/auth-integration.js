const { expect, assert } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {dbHandler} = require('ngcshelpers');
const User = require('../model/user');
const authcontroller = require('../controllers/authcontroller');
const isauth = require('../middleware/is-auth');

describe('Auth Integration', function () {
    describe('#login function', function () {
        let registeredUser;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            sinon.stub(jwt, 'sign');
            sinon.stub(bcrypt, 'compare');
            registeredUser = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com'
            });
            registeredUser = await registeredUser.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
            jwt.sign.restore();
            bcrypt.compare.restore();
        });

        it('should return signin objet response ', function (done) {
            const req = {
                body: {
                    login: registeredUser.login,
                    password: registeredUser.password
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
            bcrypt.compare.returns(new Promise((resolve, reject) => {
                return resolve(true);
            }));
            jwt.sign.returns('encryptedToken');
            authcontroller.login(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Access granted');
                expect(res.jsonObject.data).to.have.property('userId', registeredUser._id.toString());
                expect(res.jsonObject.data).to.have.property('token', 'encryptedToken');
                done();
            });
        });


    });

    describe('#updatePassword function', function () {
        let registeredUser;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            sinon.stub(bcrypt, 'hash');

            registeredUser = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com'
            });
            registeredUser = await registeredUser.save();
        });

        afterEach(async () => {
            bcrypt.hash.restore();
            await dbHandler.clearDatabase();
        });

        it('should update user password', function (done) {
            const req = {
                auth: {
                    userId: registeredUser._id.toString()
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
            bcrypt.hash.returns(new Promise((resolve, reject) => {
                return resolve('encodedPassword');
            }));
            authcontroller.updatePassword(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Password updated');
                expect(result).to.be.true;
                done();
            });

        });
    });

    describe('#isAuth function', function () {
        beforeEach(function () {
            sinon.stub(jwt, 'verify');
        });

        afterEach(function () {
            jwt.verify.restore();
        });

        it('should call decodetoken and put userId in req', function () {
            const req = {
                get: function (headerName) {
                    if (headerName === 'Authorization') {
                        return 'Bearer xyz';
                    }
                }
            }
            jwt.verify.returns({ userId: 'abc', otherParameters: 'otherParameters' });
            isauth(req, {}, () => { });
            expect(req).to.have.property('auth');
            expect(req.auth).to.have.property('userId', 'abc');
        });
    });

});