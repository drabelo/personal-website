var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../config/main');

// Load the Cloudant library.
var Cloudant = require('cloudant');

var me = 'nodejs'; // Set this to your own account
var password = '89562323';

// Initialize the library with my account.
var cloudant = Cloudant({
    account: 'drabelo',
    password: password
});

var dbname = 'crud';
var db = cloudant.db.use(dbname);

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      db.get(jwt_payload._id, function(err, data) {
          if(err != null)
            console.log("Error:", err);
          if (data) {
              //console.log("Data from passport:", data);
              return done(err, data);
          }
      });


  }));
};
