const express = require('express');
const router = express.Router();


// Gets User Dashbaord page, must be logged in to see/access
router.get('/', ensureAuthenticated, function(req, res){
  res.render('index');
});

// Gets Uesr Packages page, must be logged in to see/access
router.get('/users/package', ensureAuthenticated, function(req, res){
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
