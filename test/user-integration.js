const { expect } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { RoleServices } = require('ngcsroles');
const userController = require('../controllers/usercontroller')
const UserServices = require('../services/userservices');

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
            defaultRole = await RoleServices.createRole({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
        });

        it('should return an object if user creation succeed', function (done) {
            req = {
                body: {
                    login: 'user1',
                    password: 'password',
                    email: 'user@user.com',
                    role: defaultRole.roleId
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
                UserServices.findUser({login: 'user1'})
                    .then(user => {
                        expect(user).not.to.be.null;
                        expect(user).not.to.be.undefined;
                        expect(res.jsonObject.data).to.have.property('userId', user.userId);
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
            let defaultRole = await RoleServices.createRole({
                name: 'defaultRole',
                label: 'defaultLabel'
            });

            user1 = await UserServices.createUser({
                login: 'user1',
                password: 'password',
                email: 'user1@user.com',
                role: defaultRole.roleId
            });
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should return an object if user deletion succeed', function (done) {
            const req = {
                body: {
                    userId: user1.userId
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
                expect(res.jsonObject.data).to.have.property('userId', user1.userId);
                UserServices.findUser({login: user1.login})
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
            let defaultRole = await RoleServices.createRole({
                name: 'defaultRole',
                label: 'defaultLabel'
            });

            user = await UserServices.createUser({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole.roleId
            });
        });

        it('should return an object if update succeed', function (done) {
            const req = {
                body: {
                    userId: user.userId,
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
