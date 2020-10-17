const user = require('./model/user');


const userschema = user.model('SimpleUser').schema.obj;
console.log({ ...userschema });
