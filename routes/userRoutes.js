var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {
    layout: 'auth_base',
    title: 'User Dashboard!',
    welcome: 'Welcome to your dashboard!'
  })
})

router.get('/profile', function(req, res) {
  res.render('profile', {
    layout: 'auth_base',
    title: 'User Profile!',
    welcome: 'Welcome to your user profile'
  })
})

router.get('/search', function(req, res) {
  res.render('search', {
    layout: 'auth_base',
    title: 'Search Page',
    welcome: 'Welcome to your searches'
  })
})

router.get('/savedsearches', function(req, res) {
  res.render('savedsearches', {
    layout: 'auth_base',
    title: 'Saved Searches',
    welcome: 'Welcome to your saved searches'
  })
})

module.exports = router
