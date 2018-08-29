const express = require('express');
const methodOverride = require('method-override')
const app = express()
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

router.use(methodOverride('_method'))
// [ ] UPDATE route
// [ ] router.put()
// [ ] user data will be in req.bod
// [X] once you get method-override set up correctly
// [X] see npm.org / method-override



///// UPDATE ROUTE ////////////////////////////////////
// Where is PassportJS storing userID
//
// Update User
// router.put("/:id", async (req, res) => {
// const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true});
// res.redirect("/user");
// });
//
// Update Package Route
// router.put('/something', function(req, res){
//
//   req.body.
//   edit;
//   {key}:{value}
// });


//////////////////////////////////////////////////////

// EDIT route
  // grab shit from db
  // render an EJS that looks exactly like index.ejs, passing the data from db to that template

// // Show Package Route
// router.edit('/something', function(req, res){
//   something
// })


////////// DELETE ROUTE //////////////////
// DETLETE ROUTE NEEDS
// [X] Find PassportJS's location for IDs
// [ ] MongoDB Query to Delete based on ID
//
// router.delete('/', (req, res) => {
//   console.log("below is req.session.passports.user");
//   console.log(req.session.passport.user);
//   res.send("hello this is delete speaking, check the terminal")
// })

  // console.log(req.session.passport.user);

// Delete User
router.delete("/", async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.session.passport.user);
  res.redirect("/");
});

// router.delete("/", function(req, res){
//   const deletedUser = User.findByIdAndRemove(req.session.passport.user, function(asdf, asdf2){
//     console.log(asdf);
//     console.log(asdf2);
//   });
//   res.redirect("/");
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


module.exports = router;
