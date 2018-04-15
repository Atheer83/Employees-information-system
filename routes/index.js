var express = require('express');
var router = express.Router();
var models = require('../database/index');


router.post('/clients', function (req, res, next) {
  models.User.create(userData, function(error, user) {
    if (error) {
      return next(error);
    } else {
     return  res.json(clients);
    }

  });
});


router.get('/profile', function (req, res, next) {
  if (! req.session.userId) {
    var err = new Error('You are Not Authorized to view this page');
   err.status = 403;
   return next(err);
  }
  models.User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      return res.render('profile')
    }
  });
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


router.get('/login', function (req, res, next) {
  return res.render('login')
  next();
});

router.post('/login', function (req, res, next) {
  if (req.body.email && req.body.password) {
    models.User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong Email or Password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and Password are required');
   err.status = 401;
   return next(err);
  }
});

router.get('/register', function (req, res, next) {
  return res.render('register')
  next();
});

router.post('/register', function (req, res, next) {
 if (req.body.email &&
   req.body.name &&
   req.body.password) {

  if (req.body.password !== req.body.confirmPassword) {
    var err = new Error('password do not match');
   err.status = 400;
   return next(err);
  }

  var userData = {
   email: req.body.email, 
   name: req.body.name,
   password: req.body.password
  };

  models.User.create(userData, function(error, user) {
    if (error) {
      return next(error);
    } else {
     return  res.redirect('/profile')
    }

  });
  
 } else {
   var err = new Error('All fields require');
   err.status = 400;
   return next(err);
 }
});




module.exports = router