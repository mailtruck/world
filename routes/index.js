var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mailtruck World' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login - Mailtruck World' });
});


module.exports = router;
