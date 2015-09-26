var express = require('express');
var router = express.Router();
var axios = require('axios');
var wroth = require('wroth');
var alchemy = require('../lib/index')(process.env.ALCHEMY_API_KEY);

var admin = wroth.sessionHas('username', '/');

router.get('/', function (req, res, next) {
  res.json({});
});

router.get('/reddit', function (req, res, next) {
  axios.get('https://www.reddit.com/r/' + req.query.sub + '.json')
    .then(function(results){
      var matchDomain = 'self.' + req.query.sub;
      var posts = [];
      var reddits = results.data.data.children;
      reddits.forEach(function (ele) {
        var post = {};
        post.comments = 'https://www.reddit.com' + ele.data.permalink;
        if (ele.data.domain === matchDomain) {
          post.title = ele.data.title;
          post.text = ele.data.selftext.replace(/(\n)/gm, '');
          posts.push(post);
        } else {
          post.title = ele.data.title;
          post.url = ele.data.url;
          posts.push(post);
        }
      })
      res.json({posts: posts})
    })
});

router.post('/reddit', function (req, res, next) {
  var savePost = req.db.get('posts');
  savePost.insert(req.body)
    .then(function (result) {
      res.json(result);
    })
})

router.delete('/reddit/:id', function (req, res, next) {
  var deletePost = req.db.get('posts');
  deletePost.remove(req.params.id)
    .then(function (result) {
      res.json({status: 'ok', deleted: req.params.id});
    })
})

router.get('/alchemy/text', function (req, res, next) {
  alchemy.lookup('text', 'url', req.query.url)
    .then(function (result) {
      res.json(result)
    })
})

router.get('/profile', admin(), function (req, res, next) {
  res.json({user: req.session});
});


module.exports = router;
