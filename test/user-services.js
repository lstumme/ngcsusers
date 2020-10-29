const { expect, should, assert } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');

const userServices = require('../services/userservices');
const dbHandler = require('./db-handler');
const User = require('../model/user');

describe('User Services', function () {
    describe('#getUser', function () {
        let registeredUser;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            const user = new User({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com'
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
                    expect(result).to.have.property('_id');
                    expect(result._id.toString()).to.equal(registeredUser._id.toString());
                    expect(result).to.not.have.own.property('password');
                    done();
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
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
            for (let i = 0; i < 20; i++) {
                const user = new User({
                    login: 'user' + i,
                    password: 'password',
                    email: 'user' + i + '@user.com'
                });
                await user.save();
            }
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if range out of bounds', function (done) {
            userServices.getUsers({ page: 3, perPage: 10 })
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
            const perPage = 10;
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
            const perPage = 7;
            userServices.getUsers({ page: 1, perPage: perPage })
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