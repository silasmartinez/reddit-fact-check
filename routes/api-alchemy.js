var express = require('express');
var router = express.Router();
var axios = require('axios');
var wroth = require('wroth');
var alchemy = require('../lib/index')(process.env.ALCHEMY_API_KEY);

var admin = wroth.sessionHas('username', '/');

// alchemy api call routes

router.get('/text', function (req, res, next) {
  var getPost = req.db.get('posts');
  getPost.findById(req.query.postId)
    .then(function (post) {
      return alchemy.lookup('text', 'url', post.url);
    })
    .then(function (alchemyData) {
      return getPost.updateById(req.query.postId, {$set: {text: alchemyData.data.text}});
    })
    .then(function (result) {
      res.json(result);
    });
});

router.get('/keywords', function (req, res, next) {
  var parsedUrl = encodeURIComponent(req.query.url);
  alchemy.lookup('keywords', 'url', parsedUrl)
    .then(function (result) {
      res.json(result);
    });
});

router.get('/userInterests', function (req, res, next) {
  var userInfo = req.db.get('users');
  userInfo.findOne({id: req.query.userId})
    .then(function (profile) {
      var text = profile._json.industry + ', ';
      text += profile._json.headline + ', ';
      text += profile._json.location.name + ', ';
      text += profile._json.summary;

      return alchemy.lookup('keywords', 'text', text);
    })
    .then(function (result) {
      res.json(result.data);
    }
  );
});

router.put('/evalPost/:post', function (req, res, next) {
  var getPost = req.db.get('posts');
  var author = '';
  var storyKeys = [];
  var authorKeys = [];
  getPost.findById(req.params.post)
    .then(function (post) {
      author = post.author;
      return alchemy.lookup('keywords', 'text', post.text);
    })
    .then(function (postData) {
      console.log('postData',postData.data)
      storyKeys = postData.data.keywords
      return axios.get('https://www.reddit.com/user/' + author + '.json')
    })
    .then(function (userData) {
      console.log('userData', userData.data)
      console.log(userData.data.data.children.length)
      var text = userData.data.data.children.filter(function (ele) {
        return ele.data.body;
      }).reduce(function (acc, cur) {
        return acc + cur.data.body + ' ';
      }, '');
      text = text.substring(0, 5000);
      console.log(text.length)
      return alchemy.lookup('keywords', 'text', text);
    })
    .then(function (userKeys) {
      console.log('userKeys',userKeys.data)
      authorKeys = userKeys.data.keywords;
      console.log('story', storyKeys)
      console.log('author', authorKeys)
      return getPost.updateById(req.params.post,
        {$set: {keywords: storyKeys, authorKeys: authorKeys}});
    })
    .then(function () {
      res.json({status: 'ok'})
    });
});

router.get('/evalUser/:user', function (req, res, next) {
  axios.get('https://www.reddit.com/user/' + req.params.user + '.json')
    .then(function (user) {
      var text = user.data.data.children.filter(function (ele) {
        return ele.data.body;
      }).reduce(function (acc, cur) {
        return acc + cur.data.body + ' ';
      }, '');
      return alchemy.lookup('keywords', 'text', text);
    })
    .then(function (response) {
      res.json(response.data);
    });
});

module.exports = router;
