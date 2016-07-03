#Using LDAP and JWT authentication in Node.js
Authentication is handled by "passport", a middleware library that lets you authenticate in Node.js by specifying authentication style and a strategy.

#LDAP Authentication
For LDAP authentication, check out the passport-ldap.js file inside config. This file configs our LDAP authentication method. In the file we specify the LDAP server location, and the directory we want to search in. Then we specify what strategy that we want to use. The strategy is defined in passport-ldap-strategy.js. The strategy to authenticate is as follows, we first try to get the person in LDAP using their email. After successfully finding a user, we try to bind the user with it's password. If that returns successful, we verify the returned data against a verify method we defined in the config. If that passes, we have successfully authenticated.

Finally, to use passport, we insert it into the middle of an API call. For example:

    apiRoutes.post('/authenticate', passport.authenticate('ldap'), function(req, res) {
    });

To authenticate, we have to do a HTTP post request to /api/authenticate and pass the username and password in the headers.


#JSON Web Token Authentication
To authenticate with a JWT (JSon Web Token), we first need to have data that we want to encrypt. In the /api/authenticate API call, you can see how we use the username and password that was passed in through the header to make a JWT token. To create a JWT token, we pass in the data we want to encrypt, we pass in a secret key (that we defined in config/main.js), and the expiration date in seconds.

After you pass in all of that, you try to sign a JWT token.

    var token = jwt.sign(data, config.secret, {expiresIn: 10080});

You know have a secure token that holds encrypted user data.

To authenticate API calls with the token, you have to use passport.

    apiRoutes.get('/getaccount', passport.authenticate('jwt', {session: false}), function(req, res) {
    }

When it tries to authenticate using JWT, it's going to look for a JWT strategy.

To start off, first the jsonwebtoken needs to be installed.

    $ npm install jsonwebtoken

Then we require it in our project

    var jwt = require('jsonwebtoken');

After having that configured, I defined a config/passport.js file to implement the strategy to authenticate the JWT.

Checkout the file, and look at how I authenticated it. You can see it tries to do a DB request using encrypted data from the JWT. If that authentication returns successfully, the API then knows we are successfully authenticated, and runs the function inside of it.
