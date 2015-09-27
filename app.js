require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('monk')(process.env.MONGOLAB_URI);
var cookieSession = require('cookie-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'session',
  keys: process.env.SESSION_KEYS.split(',')
}));

app.use(passport.initialize());
app.use(passport.session());

// Add db to req
app.use(function (req, res, next) {
  req.db = db;
  next();
});

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.HOST + '/auth/linkedin/callback',
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function (accessToken, refreshToken, profile, done) {
  var userDb = db.get('users');
  userDb.findOne({id: profile.id})
    .then(function (result) {
      if (result) {
        return done(null, {id: profile.id, displayName: profile.displayName, token: accessToken});
      } else {
        userDb.insert(profile)
          .then(function () {
            return done(null, {id: profile.id, displayName: profile.displayName, token: accessToken});
          });
      }
    });
}));

app.get('/login',
  passport.authenticate('linkedin'),
  function (req, res) {
  });
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function (req, res, next) {
  res.locals.user = req.session;
  next();
});

app.get('/auth/err', function (res, req, next) {
  res.render('error', res.body);
});
app.get('/logout', function (req, res, next) {
  req.session = null;
  res.redirect('/');
});

app.use('/', routes);
app.use('/users', users);
// app.use('/repos', repos);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
