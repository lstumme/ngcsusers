
module.exports = {
    User: require('./model/user'),
    UserRoutes: require('./routes/userroutes'),
    UserController: require('./controllers/usercontroller'),
    AuthRoutes: require('./routes/authroutes'),
    isAuth: require('./middleware/is-auth'),

};

