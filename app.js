var compression = require('compression')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const uuidv5 = require('uuid/v5');

debug = true;
if (process.env.NODE_ENV == 'production')
  debug = false;

var app = express();
app.use(compression());

var index = require('./routes/index');
var users = require('./routes/users');

app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  genid: function(req) {
    return uuidv5('www.hangboi.com', uuidv5.URL); // use UUIDs for session IDs
  },
  secret: 'gttakpemguessinboutmi',
  resave: false,
  saveUninitialized: true
}))

app.use('/', index);

app.listen(8080, function() {
    debug && console.log('listining on port 8080');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;