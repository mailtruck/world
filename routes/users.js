var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const User = bookshelf.model('User', {
  tableName: 'users'
})

/* GET users listing. */
router.post('/new', function(req, res, next) {
  const hash = bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  res.json(hash);
});
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
