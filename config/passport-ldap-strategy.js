/**
 * Module dependencies.
 */
var util = require('util');
var ldap = require('ldapjs');
var passport = require('passport');

function Strategy(options, verify) {
	if (typeof options == 'function') {
		verify = options;
		options = {
			server: {
				url: ''
			},
			base: '',
			search: {
				filter: ''
			}
		};
	}
	if (!verify) throw new Error('LDAP authentication strategy requires a verify function');

	console.log("check 1")
	passport.Strategy.call(this);

	this.name = 'ldap';
	this.createClient = function() {
		return ldap.createClient(options.server);
	};
	this._verify = verify;
	this._options = options;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);


/**
 * Authenticate request by binding to LDAP server, and then searching for the user entry.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
	var username = null;
	var password = null;

	var self = this;

	username = req.headers.username;
	password = req.headers.password;


	if (!username || !password) {
		console.log("HIT HERE 401", req.headers)
		return self.fail(401);
	}

	var opts = {
		filter: "(|(mail=" + username + "))",
		scope: "sub"
	};
	var client = self.createClient();

	self.getPerson(username, client, function(err, person) {
		if (err) {
			console.log("Cannot connect : " + JSON.stringify(err));
			return self.error(err);
		}

		if (person === null) {
			console.log("User Not Found");
			return self.error(false, false);
		}

		if (person) {
			client.bind(person.dn, password, function(err) {
				if (err) {
					return self.error(err, true);
				} else {
					self._verify(person, function(err, user) {
						if (err) {
							console.log("GetPerson Error:" + err);
							return self.error(err, true);
							//return self.error(err,false,true);
						}
						if (!user) {
							return self.fail(self._challenge());
							//return self.error(false,false,true);
						}
						self.success(user);
					});
				}
			});
		}
	});
};


Strategy.prototype.getPerson = function(email, client, callback) {
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


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
