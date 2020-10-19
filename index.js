module.exports = {
    User: require('./model/user'),
    UserRoutes: require('./routes/userroutes'),
    AuthRoutes: require('./routes/authroutes'),
    isAuth: require('./middleware/is-auth'),
};

