const express = require('express');
const router = express.Router();

// Gets homepage
router.get('/', ensureAuthenticated, function(req, res){
  console.log(req.session);
  res.render('index');
});

function ensureAuthenticated(req, res, next){
  console.log("Hey, this is req.user");
  console.log(req.user);
  console.log(req.session);
  if (req.isAuthenticated()){
    console.log("This is inside of isAuthenticated");
    console.log(req.user);
    console.log(req.session);
    return next();

  } else {
    console.log("this is inside of Else isAuthenticated");
    console.log(req.user);
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
  console.log("Hey, this is req.user after ensureAuthenticated");
  console.log(req.user);
}

module.exports = router;
