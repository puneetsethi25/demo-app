var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rootQuery = require('./graphql/graph');

var cors = require('cors')

var indexRouter  = require('./routes/index');
var adminRouter  = require('./routes/admin');
var searchRouter = require('./routes/search');
var apiRouter  = require('./routes/api');
var tweetsRouter = require('./routes/tweets');

var app = express();

app.options('*', cors()) // include before other routes

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/graphql', rootQuery);

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/search', searchRouter);
app.use('/tweets', tweetsRouter);

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
