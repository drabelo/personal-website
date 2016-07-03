(function() {

  'use strict';

  var LDAPStrategy = require('./passport-ldap-strategy');


  module.exports = function module(passport) {
    var Strategy = new LDAPStrategy({
        server: {
          url: 'ldaps://bluepages.ibm.com:636'
        },
        base: 'o=ibm.com,ou=bluepages',
        search: {
          filter: 'ou=bluepages,o=ibm.com',
        },
        debug: true
      },
      function(person, done) {
        return done(null, {
          username: person.mail,
          provider: "ldap",
          id: person.serialNumber || person.uid,
          notesId: person.notesid,
          cn: person.cn,
          displayName: person.cn
        });
      });

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(Strategy);

  };

  function serializeUser(user, done) {
    done(null, user);
  }

  function deserializeUser(obj, done) {
    done(null, obj);
  }


})();
