var express = require('express');
var router = express.Router();
var axios = require('axios');
var wroth = require('wroth');

var admin = wroth.sessionHas('username', '/');

// reddit routes

router.get('/', function (req, res, next) {
  if (req.query.sub) {
    axios.get('https://www.reddit.com/r/' + req.query.sub + '.json')
      .then(function (results) {
        var matchDomain = 'self.' + req.query.sub;
        var posts = [];
        var reddits = results.data.data.children;
        reddits.forEach(function (ele) {
          var post = {};
          post.comments = 'https://www.reddit.com' + ele.data.permalink;
          post.author = ele.data.author;
          if (ele.data.domain === matchDomain) {
            post.title = ele.data.title;
            post.text = ele.data.selftext;
            posts.push(post);
          } else {
            post.title = ele.data.title;
            post.url = ele.data.url;
            post.domain = ele.data.domain;
            posts.push(post);
          }
        });
        res.json({posts: posts});
      });
  } else {
    console.log('no sub specified')
    var getPosts = req.db.get('posts');
    getPosts.find({})
      .then(function (results) {
        res.json(results);
      })
  }

});

router.post('/', function (req, res, next) {
  var post = req.body;
  var confirmPost = req.db.get('posts');
  var commentCheck = new RegExp(req.body.comments.split('/')[6]);
  confirmPost.findOne({comments: commentCheck})
    .then(function (found) {
      if (found) {
        res.json({status: 'found', id: found._id});
      } else {
        confirmPost.insert(post)
          .then(function (inserted) {
            res.json({status: 'added', id: inserted._id});
          });
      }
    });
});

router.get('/list', function (req, res, next) {
  var subList = req.db.get('subs');
  var fetchSubs = '';
  if (req.session.passport.user) {
    fetchSubs = subList.find({user: req.session.passport.user.id});
  } else {
    fetchSubs = subList.find({user: {$exists: false}});
  }
  fetchSubs.then(function (subs) {
    res.json(subs);
  });
});

router.post('/list', function (req, res, next) {
  var subList = req.db.get('subs');
  subList.insert(req.body)
    .then(function () {
      res.json({status: 'ok'});
    });
});

router.delete('/list/:id', function (req, res, next) {
  var subList = req.db.get('subs');

  subList.remove({_id: req.params.id})
    .then(function () {
      res.json({status: 'ok', removed: req.params.id});
    });
});

module.exports = router;
