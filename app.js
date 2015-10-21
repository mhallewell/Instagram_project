var express 				= require('express')
	, exphbs					= require('express-handlebars')
	, path						= require('path')
  , port     				= 3000
	, marketingRoutes			= require('./routes/marketingRoutes')
	, userRoutes			= require('./routes/userRoutes')

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', marketingRoutes)
app.use('/user', userRoutes)

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')
