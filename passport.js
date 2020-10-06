const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

//LocalStrategy defines the basic HTTP authentication for login requests

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password),
    Users.findOne({ Username: username}, (error, user) => { //only the username gets checked here
        if (error) {
            console.log(error);
            return callback(error);
        }

        if(!user) {
            console.log('incorrect username'); // message returned if username cant be found
            return callback(null, false, {message: 'Incorrect username or password.'});
        }

        console.log('finished');
        return callback(null,user);
    });
}));

// Authentication of users based on the JWT submitted alongside their request.
// Here the code is extracted from the header of the HTTP request: This JWT is called bearer-token

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret' // secret kex to verify the signature of the JWT
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));