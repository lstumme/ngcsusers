const { expect, should, assert } = require('chai');
const sinon = require('sinon');
const { ObjectId } = require('mongodb');

const userservice = require('../services/userservice');
const dbHandler = require('./db-handler');
const User = require('../model/user');

describe('User Controller', function () {
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
            userservice.getUser({ userId: ObjectId().toString() })
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
            userservice.getUser({ userId: registeredUser._id.toString() })
                .then(result => {
                    expect(result).to.have.property('_id');
                    expect(result._id.toString()).to.equal(registeredUser._id.toString());
                    done();
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                })
        });
    });
});