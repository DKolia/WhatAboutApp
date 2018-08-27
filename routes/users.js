const express = require('express');
const router = express.Router();

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

   var errors = req.validationErrors();

   if(errors){
     res.render('register',{
       errors: errors
     });
   } else {
     console.log("no errors");
   }
});


module.exports = router;
