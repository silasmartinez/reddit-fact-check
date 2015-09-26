var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('foo');
  res.redirect('/app.html');
});

router.get('/styleguide', function (req, res, next) {
  res.render('styleguide');
});

module.exports = router;
