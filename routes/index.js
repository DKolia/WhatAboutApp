const express = require('express');
const router = express.Router();

// Gets homepage
router.get('/', ensureAuthenticated, function(req, res){
  console.log(req.session);
  res.render('index');
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
