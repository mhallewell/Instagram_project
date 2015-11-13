var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    title: 'This is a title!',
    welcome: 'Welcome to the site!'
  })
})
router.get('/index', function(req, res){
  res.render('index', {
    title: 'Index Title',
    welcome: 'Welcome!'
  })
})

module.exports = router
