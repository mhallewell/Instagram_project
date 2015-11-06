var express = require('express');
var router = express.Router();

router.get('/index', function(req, res) {

  res.render('index', {
    title: 'This is a title!',
    welcome: 'Welcome to the site!'
  })
})

module.exports = router
