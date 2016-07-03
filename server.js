// Include our packages in our main server file
var express = require('express');
app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//shows GET / POST times
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./config/main');


// Use body-parser to get POST requests for API use
// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));

// Initialize passport for use
app.use(passport.initialize());

var port = 3000;

app.listen(port);

// Bring in defined Passport Strategy
require('./config/passport-ldap')(passport);

require('./config/passport')(passport);


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
var users = null;
var db = cloudant.db.use(dbname);

//LDAP Setup
var ldap = require('ldapjs');


// Create API group routes
var apiRoutes = express.Router();

// Set url for API group routes
app.use('/api', apiRoutes);

app.use(express.static(__dirname + '/public/'));

// Protect dashboard route with JWT
apiRoutes.get('/getaccount', passport.authenticate('jwt', {session: false}), function(req, res) {
    res.json({
        email: req.user._id,
        role: req.user.role
    });
});

// Protect dashboard route with JWT
apiRoutes.get('/login', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    res.send("Succesfully logged in")
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
apiRoutes.post('/authenticate', passport.authenticate('ldap'), function(req, res) {
    db.get(req.headers.username, function(err, data) {
        if (err != null) {
            console.log("Error:", err.error);
            //entering account into DB
            db.insert({
                _id: req.headers.username,
                password: req.headers.password,
                role: "user"
            }, function(err, body) {
                if (err)
                    console.log(err);
            });
        }
        if (data) {
            console.log("Succesfully retrived person in authenticate");
            // keep a copy of the doc so we know its revision token
            doc = data;

            //compare entered password and returned password
            if (data.password === req.headers.password) {
                //generating JWT
                console.log("Creating new JSON Web Toekn");
                var token = jwt.sign(data, config.secret, {expiresIn: 10080});
                console.log("Succesfully created JWT in authenticate ", token);
                res.json({
                    success: true,
                    token: 'JWT ' + token
                });
            } else {
                res.send({
                    success: false,
                    message: 'Authentication failed. Passwords did not match.'
                });

            }
        } else {
            console.log("data is null")
        }
    });
});

// // Home route. We'll end up changing this to our main front end index later.
// app.get('/', function(req, res) {
//     res.sendfile(__dirname + 'index.html');
// })
//


console.log('Your server is running on port ' + port + '.');
