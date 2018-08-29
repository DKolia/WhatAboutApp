const express = require('express');
const methodOverride = require('method-override')
const app = express()
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// UPDATE route
// router.put()
// user data will be in req.bod
// once you get method-override set up correctly
// see npm.org / method-override

// EDIT route
  // grab shit from db
  // render an EJS that looks exactly like index.ejs, passing the data from db to that template

// delete route
  // this route will be hit by your form with just a single f***ing butoon



// Update Package Route
router.put('/something', function(req, res){

});

// Show Package Route
// router.edit('/something', function(req, res){
//   something
// })



// Register Route
router.get('/register', function(req, res){
  res.render('register');
});


// Login Route
router.get('/login', function(req, res){
  res.render('login');
});


// Register Users
router.post('/register', function(req, res){
   const name = req.body.name;
   const email = req.body.email;
   const username = req.body.username;
   const password = req.body.password;
   const password2 = req.body.password2;


   // User Validation
   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   req.checkBody('email', 'Email is invalid').isEmail();
   req.checkBody('username', 'Username is required').notEmpty();
   req.checkBody('password', 'A Password is required').notEmpty();
   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

   const errors = req.validationErrors();

   if(errors){
     res.render('register',{
       errors: errors
     });
   } else {
     const newUser = new User({
       name: name,
       email: email,
       username: username,
       password: password
     });

     User.createUser(newUser, function(err, user){
       if(err) throw err;
     });
     req.flash("success_msg", "You are registered and can now log in");

     res.redirect('/users/login');
   }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if (!user){
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  }));



    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });



    passport.deserializeUser(function (id, done) {
    	User.getUserById(id, function (err, user) {
    		done(err, user);
    	});
    });


router.get('/package', function(req, res){
  res.render('package');
});


router.post(
  '/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  }

);


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "You are now logged out.");
  res.redirect("/users/login");
});


//////
// Gets packages
router.get('/package', ensureAuthenticated, function(req, res){
  res.render('package');
});


// Checks Authentication to avoid unauthorized access through URL manipulation
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}


module.exports = router;
