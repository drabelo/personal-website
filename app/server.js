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
var User = require('./app/models/user');

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

mongoose.connect(config.database);

// Bring in defined Passport Strategy
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

var client = ldap.createClient({
  url: 'ldaps://bluepages.ibm.com:636'
});

var email = "drabelo@us.ibm.com";

var test = function(email, client, callback) {
	console.log("Login request for " + email);
	var self = this;
	var opts = {
		filter: "(|(mail=" + email + "))",
		scope: "sub"
	};

	client.search('ou=bluepages, o=ibm.com', opts, function(err, res) {
		if (err) {
			callback(err);
		} else {
			var found = false;
			res.on('searchEntry', function(entry) {
				found = true;
				callback(err, entry.object);
			});
			res.on('error', function(err) {
				callback(err);
			});
			res.on('end', function(result) {
				console.log('Found in Bluepages is : ' + found);
				if (!found)
					callback(err, null);
			});
		}
	});
};

// Create API group routes
var apiRoutes = express.Router();

// Register new users
apiRoutes.post('/register', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({
            success: false,
            message: 'Please enter email and password.'
        });
    } else {

        db.insert({
            _id: req.body.email,
            password: req.body.password,
            role: req.body.role
        }, function(err, body) {
            if (err)
                console.log(err);
        });

    }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
apiRoutes.post('/authenticate', function(req, res) {


    console.log("Reading document " + req.body.email);
    db.get(req.body.email, function(err, data) {
        if (err)
            console.log("Error:", err);
        if (data) {
            console.log("Data:", data);
            // keep a copy of the doc so we know its revision token
            doc = data;

            //compare entered password and returned password
            if (data.password === req.body.password) {
                // Create token if the password matched and no error was thrown
                var token = jwt.sign(data, config.secret, { expiresIn: 10080 });
                res.json({success: true, token: 'JWT ' + token });
            } else {
                res.send({
                    success: false,
                    message: 'Authentication failed. Passwords did not match.'
                });

            }
        }
    });
});




// User.findOne({email: req.body.email}, function(err, user) {
//   if (err) throw err;
//
//   if (!user) {
//     res.send({ success: false, message: 'Authentication failed. User not found.' });
//   } else {
//     // Check if password matches
//     user.comparePassword(req.body.password, function(err, isMatch) {
//       if (isMatch && !err) {
//         // Create token if the password matched and no error was thrown
//         var token = jwt.sign(user, config.secret, {
//           expiresIn: 10080 // in minutes
//         });
//         res.json({ success: true, token: 'JWT ' + token });
//       } else {
//         res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
//       }
//     });
//   }
// });
// });

// Protect dashboard route with JWT
apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.send("Sucessfully authenticated into dashboard");
});

// Protect dashboard route with JWT
apiRoutes.get('/getaccount', passport.authenticate('jwt', { session: false }), function(req, res) {
    console.log("Sucessfully got account")
  res.send(req.user);
});

// Set url for API group routes
app.use('/api', apiRoutes);

app.use(express.static(__dirname + '/public/'));

// Home route. We'll end up changing this to our main front end index later.
app.get('/', function(req, res) {
    res.sendfile(__dirname + 'index.html');
})

app.get('/register', function(req, res) {
    res.sendfile(__dirname + '/public/register.html');
})

app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/public/login.html');
})


console.log('Your server is running on port ' + port + '.');
