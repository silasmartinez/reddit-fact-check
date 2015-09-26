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
var GithubStrategy = require('passport-github').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
//var repos = require('./routes/repos');
var api = require('./routes/api');

var app = express();

app.use(function (req, res, next) {
  app.locals.title = 'Reddit Fact Checker';
  app.locals.tagline = 'I read it on the internet - it must be true..';
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'session',
  keys: process.env.SESSION_KEYS.split(',')
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.HOST + '/auth/callback'
}, function (accessToken, refreshToken, profile, done) {
  done(null, {
    accessToken: accessToken,
    profile: profile
  });
}));
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Add db to req
app.use(function (req, res, next) {
  req.db = db;
  next();
});

app.use(function (req, res, next) {
  res.locals.user = req.session;
  next();
});

app.use(function (req, res, next) {
  var localRepos = req.db.get('repositories');
  localRepos.findOne({})
    .then(function (doc) {
      var myInfo = doc.owner;
      res.locals.githubUrl = myInfo.html_url;
      res.locals.myAvatar = myInfo.avatar_url;
      next();
    });
});

app.get('/login', passport.authenticate('github'));
app.get('/auth/callback',
  passport.authenticate('github', {failureRedirect: '/auth/error'}), function (req, res, next) {
    console.log('foo');
    var adminUsers = ['silasmartinez'];
    req.session.name = req.user.profile.displayName;
    req.session.username = req.user.profile.username;
    if (adminUsers.indexOf(req.user.profile.username) >= 0) {
      req.session.isAdmin = 1;
    }
    res.redirect('/');
  }
);

app.get('/auth/err', function (res, req, next) {
  res.render('error', res.body);
});
app.get('/logout', function (req, res, next) {
  req.session = null;
  res.redirect('/');
});

app.use('/', routes);
app.use('/users', users);
//app.use('/repos', repos);
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
