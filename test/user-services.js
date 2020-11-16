const { expect, should, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { ObjectId } = require('mongodb');

const userServices = require('../services/userservices');
const User = require('../model/user');
const { Role } = require('ngcsroles');

describe('User Services', function () {
    describe('#createUser', function () {
        let defaultRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            defaultRole = new Role({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
            defaultRole = await defaultRole.save();

            const user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole._id
            });
            await user.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if a user with given login already exists', function (done) {
            const params = { login: 'registeredUser', password: 'password', email: 'notusedemail@user.com', role: defaultRole._id };
            userServices.createUser(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `User ${params.login} already exists`);
                    expect(err).to.have.property('statusCode', 409);
                    done();
                })
        });

        it('should throw an error if a user with given email already exists', function (done) {
            const params = { login: 'newUser', password: 'password', email: 'user@user.com', role: defaultRole._id };
            userServices.createUser(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `A user with email ${params.email} already exists`);
                    expect(err).to.have.property('statusCode', 409);
                    done();
                })
        });

        it('should create a user', function (done) {
            const params = { login: 'newUser', password: 'password', email: 'newUser@user.com', role: defaultRole._id };
            userServices.createUser(params)
                .then(result => {
                    User.findOne({ 'login': params.login })
                        .then(newUser => {
                            if (!newUser) {
                                assert.fail('User not created');
                            }
                            expect(newUser).to.have.property('login', params.login);
                            expect(result).to.have.property('login', params.login);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('UserService Error');
                })
        });

    });
    describe('#deleteUser', function () {
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
            const user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole._id
            });
            await user.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if user to delete is not found', function (done) {
            const id = new ObjectId();
            const params = { userId: id.toString() };
            userServices.deleteUser(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find user.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should delete user if user exists', function (done) {
            User.findOne({ login: 'registeredUser' })
                .then(user => {
                    const params = { userId: user._id.toString() };
                    userServices.deleteUser(params)
                        .then(result => {
                            User.countDocuments({}, function (err, count) {
                                if (err) {
                                    assert.fail('Database Error');
                                }
                                expect(count).to.equal(0);
                                done();
                            });
                        })
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                })
        });
    });
    describe('#updateUserDetails', function () {
        let newRole;
        let defaultRole;
        let user;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            defaultRole = new Role({
                name: 'defaultRole',
                label: 'defaultLabel'
            });
            defaultRole = await defaultRole.save();

            newRole = new Role({
                name: 'newRole',
                label: 'newRoleLabel'
            });
            newRole = await newRole.save()

            user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole._id
            });
            user = await user.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if user to update is not found', function (done) {
            const params = { userId: (new ObjectId()).toString() };
            userServices.updateUserDetails(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find user.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should update User firstname if firstname is provided', function (done) {
            const params = { userId: user._id.toString(), firstname: 'UserFirstName' };
            userServices.updateUserDetails(params)
                .then(result => {
                    expect(result).to.have.property('login', 'registeredUser');
                    expect(result).to.have.property('firstname', params.firstname);
                    User.findOne({ login: 'registeredUser' })
                        .then(newUser => {
                            expect(newUser).to.have.property('firstname', params.firstname);
                            expect(newUser).to.have.property('lastname', undefined);
                            expect(newUser).to.have.property('avatar', undefined);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        })

        it('should update User lastname if lastname is provided', function (done) {
            const params = { userId: user._id.toString(), lastname: 'UserLastName' };
            userServices.updateUserDetails(params)
                .then(result => {
                    expect(result).to.have.property('login', 'registeredUser');
                    expect(result).to.have.property('lastname', params.lastname);
                    User.findOne({ login: user.login })
                        .then(newUser => {
                            expect(newUser).to.have.property('firstname', undefined);
                            expect(newUser).to.have.property('lastname', params.lastname);
                            expect(newUser).to.have.property('avatar', undefined);
                            done();
                        })
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                });
        });

        it('should update User avatar if avatar is provided', function (done) {
            const params = { userId: user._id.toString(), avatar: 'UserAvatar' };
            userServices.updateUserDetails(params)
                .then(result => {
                    expect(result).to.have.property('login', user.login);
                    expect(result).to.have.property('avatar', params.avatar);
                    User.findOne({ login: user.login })
                        .then(newUser => {
                            expect(newUser).to.have.property('firstname', undefined);
                            expect(newUser).to.have.property('lastname', undefined);
                            expect(newUser).to.have.property('avatar', params.avatar);
                            done();
                        })
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                });
        });

        it('should update User role if role is provided', function (done) {
            const params = {
                userId: user._id.toString(),
                role: newRole._id.toString()
            };
            userServices.updateUserDetails(params)
                .then(result => {
                    expect(result).to.have.property('login', user.login);
                    expect(result).to.have.property('role', newRole._id.toString());
                    User.findOne({ login: user.login })
                        .then(newUser => {
                            expect(newUser).to.have.property('firstname', undefined);
                            expect(newUser).to.have.property('lastname', undefined);
                            expect(newUser).to.have.property('avatar', undefined);
                            expect(newUser.role.toString()).to.equal(newRole._id.toString());
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        });

        it('should update User details if everything is provided', function (done) {
            const params = {
                userId: user._id.toString(),
                firstname: 'UserFirstName',
                lastname: 'UserLastName',
                avatar: 'UserAvatar',
                role: newRole._id.toString()
            };
            userServices.updateUserDetails(params)
                .then(result => {
                    expect(result).to.have.property('login', 'registeredUser');
                    expect(result).to.have.property('firstname', params.firstname);
                    expect(result).to.have.property('lastname', params.lastname);
                    expect(result).to.have.property('avatar', params.avatar);
                    expect(result).to.have.property('role', params.role);
                    User.findOne({ login: 'registeredUser' })
                        .then(newUser => {
                            expect(newUser).to.have.property('firstname', params.firstname);
                            expect(newUser).to.have.property('lastname', params.lastname);
                            expect(newUser).to.have.property('avatar', params.avatar);
                            expect(newUser.role.toString()).to.equal(newRole._id.toString());
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        });

    });

    describe('#getUser', function () {
        let registeredUser;
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
            const user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole._id
            });
            registeredUser = await user.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if User not found', function (done) {
            userServices.getUser({ userId: ObjectId().toString() })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'User not found.');
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should return a user object if user found', function (done) {
            userServices.getUser({ userId: registeredUser._id.toString() })
                .then(result => {
                    expect(result).to.have.property('userId', registeredUser._id.toString());
                    expect(result).to.haveOwnProperty('login');
                    expect(result).to.haveOwnProperty('email');
                    expect(result).to.haveOwnProperty('firstname');
                    expect(result).to.haveOwnProperty('lastname');
                    expect(result).to.haveOwnProperty('avatar');
                    expect(result).to.haveOwnProperty('role');
                    expect(result).to.not.have.own.property('password');
                    done();
                })
                .catch(err => {
                    assert.fail(err.toString());
                })
        });
    });

    describe('#getUsers', function () {
        let registeredUser;
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
            for (let i = 0; i < 20; i++) {
                const user = new User({
                    login: 'user' + i,
                    password: 'password',
                    email: 'user' + i + '@user.com',
                    role: defaultRole._id
                });
                await user.save();
            }
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if range out of bounds', function (done) {
            userServices.getUsers({ page: '3', perPage: '10' })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Pagination out of bounds.');
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
        });

        it('should return an object contianing the required data and the number of pages', function (done) {
            const perPage = '10';
            userServices.getUsers({ page: 1, perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 2);
                    expect(result).to.have.property('users').to.have.lengthOf(perPage);
                    for (let i = 0; i < perPage; i++) {
                        expect(result.users[i]).to.not.have.own.property('password');
                    }
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });

        it('should return an object contianing the required data and the number of pages 2', function (done) {
            const perPage = '7';
            userServices.getUsers({ page: '1', perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 3);
                    expect(result).to.have.property('users').to.have.lengthOf(perPage);
                    for (let i = 0; i < perPage; i++) {
                        expect(result.users[i]).to.not.have.own.property('password');
                    }
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });

    });

});