var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

var bookshelf = require('../bookshelf');
const User = bookshelf.model('User', {
  tableName: 'users'
})

/* GET users listing. */
router.post('/new', function(req, res, next) {
  var errors = []
  if (req.body.name === "") {
	errors.push("Name is required.")
  }
  if (req.body.username === "") {
	errors.push("Username is required.")
  }
  if (req.body.email === "") {
	errors.push("Email is required.")
  }
  if (req.body.password === "") {
	errors.push("Password is required.")
  }
  if (req.body.password.length < 5) {
	errors.push("Password must be at least 5 characters.")
  }
  if (req.body.password !== req.body.password2) {
	errors.push("Passwords should match.")
  }
  if (errors.length > 0) {
    return res.render('register', { title: 'Register', errors: errors, body: req.body });
  }
  const hash = bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  User.forge({username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hash
  }).save().then(function(saved){
     console.log(saved)
     req.session.flash.message = "Registration successful"
     res.redirect(302, '/login')
  }).catch(function(error){
      errors.push("something went wrong")
      console.log(error)
      return res.render('register', { title: 'Register', errors: errors, body: req.body });
  })

});
});

router.post('/', function(req, res, next) {
  var errors = []
  if (req.body.username === "") {
    errors.push("Username is required.")
  }
  if (req.body.password === "") {
	errors.push("Password is required.")
  }
  if (errors.length > 0) {
    return res.render('login', { title: 'Login', errors: errors, body: req.body });
  }
  User.where({username: req.body.username}).fetch().then((user)=>{
    bcrypt.compare(req.body.password, user.attributes.password, function(err, result) {
      if (!result) {
	console.log("Invalid password")
	errors.push("Invalid password.")
      } else {
      	console.log("password good")
      }
      if (errors.length > 0) {
        return res.render('login', { title: 'Login', errors: errors, body: req.body   });
      } else {
      req.session.user = user
      return res.redirect('/');
    }
    });
    
  })
  
});

module.exports = router;
