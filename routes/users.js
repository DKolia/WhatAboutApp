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



module.exports = router;
