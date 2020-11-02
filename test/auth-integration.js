const { expect, assert } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbHandler = require('./db-handler');
const User = require('../model/user');
const authcontroller = require('../controllers/authcontroller');

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
});