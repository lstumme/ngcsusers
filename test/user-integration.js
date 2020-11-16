const { expect } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { Role } = require('ngcsroles');
const userController = require('../controllers/usercontroller')
const User = require('../model/user');

describe('User Integration', function () {
    describe("#createUser function", function () {
        let defaultRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        beforeEach(async () => {
            defaultRole = new Role({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
            defaultRole = await defaultRole.save();
        });

        it('should return an object if user creation succeed', function (done) {
            req = {
                body: {
                    login: 'user1',
                    password: 'password',
                    email: 'user@user.com',
                    role: defaultRole._id
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

            userController.createUser(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 201);
                expect(res.jsonObject).to.have.property('message', 'User created');
                User.findOne({ login: 'user1' })
                    .then(user => {
                        expect(user).not.to.be.null;
                        expect(user).not.to.be.undefined;
                        expect(res.jsonObject.data).to.have.property('userId', user._id.toString());
                        expect(res.jsonObject.data).to.have.property('email', req.body.email);
                        expect(res.jsonObject.data).to.have.property('login', req.body.login);
                        expect(res.jsonObject.password).to.be.undefined;
                        done();
                    });
            });
        });
    });

    describe("#deleteUser function", function () {
        let user1;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            let defaultRole = new Role({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
            defaultRole = await defaultRole.save();

            user1 = new User({
                login: 'user1',
                password: 'password',
                email: 'user1@user.com',
                role: defaultRole._id
            });
            user1 = await user1.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should return an object if user deletion succeed', function (done) {
            const req = {
                body: {
                    userId: user1._id
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

            userController.deleteUser(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'User deleted');
                expect(res.jsonObject.data).to.have.property('userId', user1._id.toString());
                User.findOne({ login: user1.login })
                    .then(user => {
                        expect(user).to.be.null;
                        done();
                    })
            });
        });
    });

    describe("#updateUserDetails function", function () {
        let user;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            let defaultRole = new Role({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
            defaultRole = await defaultRole.save();

            user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole._id
            });
            await user.save();
        });

        it('should return an object if update succeed', function (done) {
            const req = {
                body: {
                    userId: user._id.toString(),
                    firstame: 'firstName',
                    lastname: 'lastName',
                    avatar: 'avatar'
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

            userController.updateUserDetails(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'User updated');
                expect(res.jsonObject.data).to.have.property('userId', req.body.userId);
                expect(res.jsonObject.data).to.have.property('login', user.login);
                expect(res.jsonObject.data).to.have.property('firstname', req.body.firstname);
                expect(res.jsonObject.data).to.have.property('lastname', req.body.lastname);
                expect(res.jsonObject.data).to.have.property('avatar', req.body.avatar);
                done();
            });
        });
    });
});
