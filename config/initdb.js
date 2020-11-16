const { Role, RoleServices } = require('ngcsroles');

const usersRoleName = 'users';
const usersLabelName = 'Utilisateur'
const adminRoleName = 'administrators'
const toolsRoleName = 'toolsmanagers';

const initdb = async () => {
    return RoleServices.findRole(usersRoleName)
        .then(users => {
            if(!users) {
                return RoleServices.createGroup({name: usersRoleName, label: usersLabelName});
            }
            return users;
        })
        .then(users => {
            RoleServices.findRole(adminRoleName)
                .then(admins => {
                    if(!admins) {
                        const error = new Error(adminRoleName + ' role not found');
                        throw error;
                    }
                    if(!admins.subRoles.include(users.roleId)) {
                        return RoleServices.addSubRoleToRole({parentRoleId: admins.roleId, subRoleId: users.roleId})
                            .then(result => {
                                return users;
                            }) 
                    }
                    return users;
                })
        })
        .then(users => {
            RoleServices.findRole(toolsRoleName)
                .then(admins => {
                    if(!admins) {
                        const error = new Error(toolsRoleName + ' role not found');
                        throw error;
                    }
                    if(!admins.subRoles.include(users.roleId)) {
                        return RoleServices.addSubRoleToRole({parentRoleId: admins.roleId, subRoleId: users.roleId})
                            .then(result => {
                                return users;
                            }) 
                    }
                    return users;
                })
        })
}

module.exports = initdb;