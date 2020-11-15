const { Group, GroupServices } = require('ngcsgroups');

const initdb = async () => {
    return Group.findOne({ name: 'users' })
        .then(group => {
            if (!group) {
                return GroupServices.createGroup({ name: 'users', label: 'Utilisateurs' });
            }
            return group;
        })
        .then(group => {
            return Group.findOne({ name: 'administrators' })
                .then(adminGroup => {
                    if (!adminGroup) {
                        const error = new Error('Administrators group not found');
                        throw error;
                    }
                    if (!adminGroup.groups.include(group._id.toString())) {
                        return GroupServices.addGroupToGroup(adminGroup._id.toString(), group._id.toString())
                            .then(result => {
                                return group;
                            })
                    }
                    return group;
                })
        })
        .then(group => {
            return Group.findOne({ name: 'toolsmanagers' })
                .then(toolsGroup => {
                    if (!toolsGroup) {
                        const error = new Error('ToolsManagers group not found');
                        throw error;
                    }
                    if (!toolsGroup.groups.include(group._id.toString())) {
                        return GroupServices.addGroupToGroup(toolsGroup._id.toString(), group._id.toString())
                            .then(result => {
                                return group;
                            })
                    }
                    return group;
                })
        })
}

module.exports = initdb;