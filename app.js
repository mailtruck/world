var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var fileStoreOptions = {};


var flash = require('express-flash');
var app = express();

app.use(cookieParser('change me'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: new FileStore(fileStoreOptions),
    saveUninitialized: true,
    resave: 'false',
    secret: 'change me'
}));
app.use(flash());

app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Route that creates a flash message using the express-flash module
app.all('/express-flash', function( req, res ) {
    req.flash('info', 'This is a flash message using the express-flash module.');
    req.session.save(() => res.redirect("/"));
});
// Route that creates a flash message using custom middleware
app.all('/session-flash', function( req, res ) {
    req.session.sessionFlash = {
        type: 'success',
        message: 'This is a flash message using custom middleware and express-session.'
    }
    res.redirect(301, '/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
