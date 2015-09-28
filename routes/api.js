var express = require('express');
var router = express.Router();
var axios = require('axios');
var wroth = require('wroth');

var admin = wroth.sessionHas('username', '/');

router.get('/', function (req, res, next) {
  res.json({});
});

router.get('/posts/:id', function (req, res, next) {
  var getPost = req.db.get('posts');
  getPost.findById(req.params.id)
    .then(function (result) {
      res.json(result);
    });
});

router.get('/profile', function (req, res, next) {
  res.json({user: req.session.passport.user});
});

module.exports = router;
