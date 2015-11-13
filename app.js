var express 				= require('express')
var exphbs					= require('express-handlebars')
var path						= require('path')
var marketingRoutes	= require('./routes/marketingRoutes')
var userRoutes			= require('./routes/userRoutes')
var bodyParser 			= require('body-parser')
var request 				= require('request')
var querystring 		= require('querystring')
var session 				= require('express-session')
var cfg 						= require('./config')

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', marketingRoutes)
app.use('/user', userRoutes)

app.use(session({
  cookieName: 'session',
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true
}))

//app.use(bodyParser.urlencoded({extended: false })) //parses data into a usable object
app.get('/', function(req, res){
  res.render('index')
})
app.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }

  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res){
  if(req.query.error == 'access_denied'){
    return res.redirect('/')
  }
  var post_data = {
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    redirect_uri: cfg.redirect_uri,
    grant_type: 'authorization_code',
    code: req.query.code
  }

  var options = {
    url:  'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body){
    var data = JSON.parse(body)
    req.session.access_token = data.access_token
    res.redirect('/user/dashboard')
  })
})



app.get('/user/dashboard', function (req, res, next) {
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
    res.render('feed', {
      feed: feed.data
    })
  })
})
// app.use(function(err, req, res, next){
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err
//     error: {}
//   });
// });

app.listen(3000)
