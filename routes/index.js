const express = require('express');
const router = express.Router();

// Gets homepage
router.get('/', ensureAuthenticated, function(req, res){
  res.render('index');
});

function ensureAuthenticated(req, res, next){
  console.log("Hey, this is req.user");
  console.log(req.user);
  if (req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');  // ???
    res.redirect('users/login');
  }
  console.log("Hey, this is req.user after ensureAuthenticated");
  console.log(req.user);
}

module.exports = router;
