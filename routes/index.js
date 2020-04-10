var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mailtruck World' });
});

router.get('/login', function(req, res, next) {
  var flash = "";
  if (req.session.flash){
    if (req.session.flash.message) {
      flash = req.session.flash.message;
      delete req.session.flash.message;
    }
  }
  res.render('login', { title: 'Login', flash: flash});
});

router.get('/register', function(req, res, next) {
  var body = {};
  body.name = '';
  body.username = '';
  body.email = '';
  body.password = '';
  body.password2 = '';
  res.render('register', { title: 'Register', body: body});
});


module.exports = router;
