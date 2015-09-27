var express = require('express');
var router = express.Router();
var axios = require('axios');
var wroth = require('wroth');
var alchemy = require('../lib/index')(process.env.ALCHEMY_API_KEY);

var admin = wroth.sessionHas('username', '/');

router.get('/', function (req, res, next) {
  console.log(req.session.passport.user);
  res.json({});
});

router.get('/reddit', function (req, res, next) {
  axios.get('https://www.reddit.com/r/' + req.query.sub + '.json')
    .then(function (results) {
      var matchDomain = 'self.' + req.query.sub;
      var posts = [];
      var reddits = results.data.data.children;
      reddits.forEach(function (ele) {
        var post = {};
        post.comments = 'https://www.reddit.com' + ele.data.permalink;
        if (ele.data.domain === matchDomain) {
          post.title = ele.data.title;
          post.text = ele.data.selftext;
          posts.push(post);
        } else {
          post.title = ele.data.title;
          post.url = ele.data.url;
          posts.push(post);
        }
      });
      res.json({posts: posts});
    });
});

router.post('/reddit', function (req, res, next) {
  var post = req.body;
  var confirmPost = req.db.get('posts');
  var commentCheck = new RegExp(req.body.comments.split('/')[6]);
  confirmPost.findOne({comments: commentCheck})
    .then(function (found) {
      console.log('first find returned:', found);
      if (found) {
        console.log(found._id);
        res.json({status: 'found', id: found._id});
      } else {
        confirmPost.insert(post)
          .then(function (inserted) {
            console.log('added', inserted);
            res.json({status: 'added', id: inserted._id});
          });
      }
    });

});

router.get('/posts/:id', function (req, res, next) {
  var getPost = req.db.get('posts');
  getPost.findById(req.params.id)
    .then(function (result) {
      console.log(result);
      res.json(result);
    });
});

router.get('/alchemy/text', function (req, res, next) {
  alchemy.lookup('text', 'url', req.query.url)
    .then(function (result) {
      res.json(result);
    });
});

router.get('/profile', function (req, res, next) {
  console.log(req.session.passport.user);
  res.json({user: req.session.passport.user});
});

module.exports = router;
