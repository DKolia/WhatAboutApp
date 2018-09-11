const express = require('express');
const methodOverride = require('method-override')
const app = express()
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

router.use(methodOverride('_method'))


router.put("/package", function (req, res) {
  console.log("above is line 13");
  console.log(req.session.passport.user);
  User.findByIdAndUpdate(req.session.passport.user, req.body, function (err, r) {
    console.log(req.body);
    console.log(r);
    res.redirect("/users/packages/" + r.username);
  });
});




// Delete User Route
router.delete("/", async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.session.passport.user);
  res.redirect("/");
});


// Register Route
router.get('/register', function(req, res){
  res.render('register');
});


// Login Route
router.get('/login', function(req, res){
  res.render('login', {
  });
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


// PassportJS to help us add login logic, check passwords and more
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





// Route to redirect to unique user's package
router.get('/packages/:username', function (req, res) {
    User.findOne({username : req.params.username}, function(err, r) {
      console.log(r);
      console.log("This is line 126");
      res.render('package', r);
    });
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


module.exports = router;
