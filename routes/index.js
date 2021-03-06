var express = require('express');
var router = express.Router();
var userIdFromSession = require('../helpers/user-id-from-session')
var bookshelf = require('../bookshelf');

const Note = bookshelf.model('Note', {
  tableName: 'notes'
})

router.get('/error', function(req, res, next) {
    return res.render('error2', { title: 'Error 500'});
});

router.get('/unauthorized', function(req, res, next) {
    return res.render('unauthorized', { title: 'Unauthorized'});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user)
  var uid = userIdFromSession(req);
  console.log(uid)
  if (uid === 0) {
    return res.render('index', { title: 'Mailtruck World', uid: uid});
  }

  Note.where({uid: uid}).fetchAll().then(records=> {
    var notes = records.map((record)=> {
      return record.attributes
    })

    return res.render('index', { title: 'Mailtruck World', uid: uid, notes: notes});
 
  }).catch(err=> {
    console.log(err)
  })

});

router.get('/notes/:id', function(req, res, next) {
  var { id } = req.params;
  var uid = userIdFromSession(req);
  if (uid === 0) {
    res.redirect('/login')
  }

  Note.where({id: id}).fetch().then(result=>{
    var { uid: nuid } = result.attributes
    if (nuid !== uid) {
      res.redirect('/unauthorized')
    } 
    return res.render('note', {uid: uid, note: result.attributes});

  }).catch(err=>{
    console.log(err)
    res.redirect('/error')
  })

})

router.get('/notes/', function(req, res, next) {
  console.log(req.session.user)
  var uid = userIdFromSession(req);
  if (uid === 0) {
    res.redirect('/login')
  }
  res.render('notes-edit', { title: 'New Note', uid: uid, id: 0});
});

router.post('/notes/', function(req, res, next) {
  var uid = userIdFromSession(req);
  if (uid === 0) {
    res.redirect('/login')
  }
	// validate title
  if (req.body.id === "0") {
    Note.forge({title: req.body.title, note:req.body.note, uid: uid}).save().then((note)=> {
	    console.log("note saved ")
	    console.log(note)

            res.redirect('/notes/'+note.id)
    }).catch((err)=>{
	    console.log("note save failure")
	    console.log(err)
    })

  } else  {
            res.json(req.body)
  }

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

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){});
  res.redirect('/');
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
