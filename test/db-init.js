const { expect, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { RoleServices } = require('ngcsroles');
const initdb = require('../config/initdb');

describe('Databse Initialization', function () {
    before(async () => {
        await dbHandler.connect();
    });

    after(async () => {
        await dbHandler.closeDatabase();
    });

    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    it('should throw an error if administrators role not found', function (done) {
        initdb()
            .then(result => {
                console.log("result : " + result)
                assert.fail();
            })
            .catch(err => {
                expect(err).to.have.property('message', 'administrators role not found');
                done();
            })
    });

    it('should throw an error if toolsmanagers role not found', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
            .then(admins => {
                initdb()
                    .then(result => {
                        console.log("result : " + result)
                        assert.fail();
                    })
                    .catch(err => {
                        expect(err).to.have.property('message', 'toolsmanagers role not found');
                        done();
                    })
            })
    });

    it('should create a user role and add it as subRole to admins and toolsmanager', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
            .then(admins => {
                RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                    .then(tools => {
                        initdb()
                            .then(result => {
                                RoleServices.findRole({ name: 'users' })
                                    .then(users => {
                                        expect(users).not.to.be.null;
                                        expect(users).not.to.be.undefined;
                                        return users;
                                    })
                                    .then(users => {
                                        return RoleServices.findRole({ name: 'administrators' })
                                            .then(newAdmins => {
                                                expect(newAdmins.subRoles).includes(users.roleId);
                                                return users;
                                            })
                                    })
                                    .then(users => {
                                        return RoleServices.findRole({ name: 'toolsmanagers' })
                                            .then(newTools => {
                                                expect(newTools.subRoles).includes(users.roleId);
                                                return users;
                                            })
                                    })
                                    .then(users => {
                                        done();
                                    })
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        assert(fail);
                    })
            })
    });


    it('should add users as subRole of administrators', function (done) {
        RoleServices.createRole({ name: 'users', label: 'users' })
            .then(users => {
                RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                    .then(admins => {
                        RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                            .then(tools => {
                                RoleServices.addSubRoleToRole({ parentRoleId: tools.roleId, subRoleId: users.roleId })
                                    .then(r => {
                                        initdb()
                                            .then(result => {
                                                return users;
                                            })
                                            .then(users => {
                                                return RoleServices.findRole({ name: 'administrators' })
                                                    .then(newAdmins => {
                                                        expect(newAdmins.subRoles).includes(users.roleId);
                                                        return users;
                                                    })
                                            })
                                            .then(users => {
                                                done();
                                            })
                                    });
                            });
                    });
            });
    });

    it('should add users as subRole of toolsmangers', function (done) {
        RoleServices.createRole({ name: 'users', label: 'users' })
            .then(users => {
                RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                    .then(tools => {
                        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                            .then(admin => {
                                RoleServices.addSubRoleToRole({ parentRoleId: admin.roleId, subRoleId: users.roleId })
                                    .then(r => {
                                        initdb()
                                            .then(result => {
                                                return users;
                                            })
                                            .then(users => {
                                                return RoleServices.findRole({ name: 'toolsmanagers' })
                                                    .then(newTools => {
                                                        expect(newTools.subRoles).includes(users.roleId);
                                                        return users;
                                                    })
                                            })
                                            .then(users => {
                                                done();
                                            })
                                    });
                            });
                    });
            });
    });


});