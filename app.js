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
var db              = require('./db')
var Users           = require('./models/users')

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false })) //parses data into a usable object

app.use(session({
  cookieName: 'session',
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true
}))

app.use('/', marketingRoutes)
app.use('/user', userRoutes)

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

// var url = 'https://api.instagram.com/v1/tags/search?q='+ query + '&access_token=' + ACCESS-TOKEN

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
    var user = data.user

    req.session.access_token = data.access_token
    // Add userId session variable found in data.user.id
    req.session.userId = data.user.id
    user._id = user.id
    delete user.id

    // Call find method of users model to check if user exists in mongodb
    Users.find(user._id, function(document){
      if(!document){
        // If no user found then call insert method of user model
        Users.insert(user, function(result){
          res.redirect('/feed')
        })
      } else {
        // If user is found then just redirect like you are below
        res.redirect('/user/dashboard')
      }
    })
  })
})

db.connect('mongodb://dbuser:password@ds049548.mongolab.com:49548/testing', function(err){
  if(err){
    console.log('Unable to connect to Mongo')
    process.exit(1)
  } else {
    app.listen(3000, function(){
      console.log('Listening on port 3000...')
    })
  }
})
