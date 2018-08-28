const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

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
   console.log("this is req.body @ 26");
   console.log(req.body);

   // User Validation
   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   req.checkBody('email', 'Email is invalid').isEmail();
   req.checkBody('username', 'Username is required').notEmpty();
   req.checkBody('password', 'A Password is required').notEmpty();
   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  console.log("this is req.body @ 35");
  console.log(req.body);

   const errors = req.validationErrors();

   if(errors){
     res.render('register',{
       errors: errors
     });
   } else {
     console.log("this is req.body @ 44");
     console.log(req.body);
     const newUser = new User({
       name: name,
       email: email,
       username: username,
       password: password
     });

     User.createUser(newUser, function(err, user){
       if(err) throw err;
       console.log(user);
     });
     req.flash("success_msg", "You are registered and can now log in");
     console.log("this is req.body @ 57");
     console.log(req.body);

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
      console.log("This is user :" + user);
      console.log("This is password: " + password);
      console.log("This is userDOTpassword: " + user.password);

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

    // passport.deserializeUser(function (id, done) {
    //   User.findOne({id: id}, function (err, user) {
    //     done(err, user);
    //   });
    // });

    passport.deserializeUser(function (id, done) {
    	User.getUserById(id, function (err, user) {
    		done(err, user);
    	});
    });


router.post(
  '/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    console.log("WORKING");
    console.log(req.user);
    res.redirect('/');
  }
  // (req, res) => { console.log(req.body); res.send("check the terminal")}
);

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "You are now logged out.");
  res.redirect("/users/login");
});


module.exports = router;
