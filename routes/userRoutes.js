var express = require('express');
var request = require('request')
var router = express.Router();

router.get('/dashboard', function(req, res, next) {
  // res.render('dashboard', {
  //   layout: 'auth_base',
  //   title: 'User Dashboard!',
  //   welcome: 'Welcome to your dashboard!'
  // })
  console.log('here')
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token='+ req.session.access_token
  }
  request.get(options, function(error, response, body){
    if(error) {return next(error)}

    try{
        var feed = JSON.parse(body)
    }
    catch(err){
      return res.redirect('/')
    }

    if(feed.meta.code > 200){
      return next(feed.meta.error_message)
    }
    console.log(feed)
    res.render('dashboard', {
      feed: feed.data
    })
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
