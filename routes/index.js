var Nohm = require('nohm').Nohm
  , userModel = require('../lib/models/user.js')
  , passport = require('passport')
  , util = require('util')
  ;

exports.index = function (req, res) {
  res.render('index', {
    title : 'Hello World'
  });
};

exports.login = {
  get : function (req, res) {

    res.render('login', {
      title : 'Login',
      err: req.flash('error')
    });
  },

  post : passport.authenticate('local', {
    successRedirect : '/home',
    failureRedirect : '/login',
    failureFlash: true
  })

};

exports.logout = function (req, res) {
  req.logOut();
  res.redirect('/');
};

exports.register = {
  get : function (req, res) {
    res.render('register', {
      title : 'Register'
    });
  },

  post : function (req, res, next) {
    var user = Nohm.factory('User');

    user.p('email', req.param('email'));
    user.p('password', req.param('password'));

    user.save(function (err) {
      if (err) {
        //build an error parser for errors in user.errors for more granular errors
        console.log('Error registering : %s', util.inspect(user.errors));
        res.render('register', {
          title : 'Register',
          err   : 'Looks like Your Form Data Was Invalid, Try Again'
        });
      } else {
          //Authenticate the current session if registration succeeds
          passport.authenticate('newUser', function(err, user, info) {
            if (err) return next(err);
            if (!user) return res.redirect('/login');
            req.logIn(user, function(err) {
              if (err) return next(err);
              return res.redirect('/home');
            });
          })(req, res, next);
      }
    });
  }
};

exports.home = function (req, res) {
  res.render('home', {
    title : 'Home'
  });
};

exports.notFound = function(req, res) {
  res.render('error/404', {
    title : 'Not found 404'
  });
};
