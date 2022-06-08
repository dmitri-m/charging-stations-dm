var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const stationTypesRouter = require('./routes/station-types-route');
const companiesRouter = require('./routes/companies-route');
const stationRouter = require('./routes/stations-route');
const scriptRouter = require('./routes/script-route');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.text({defaultCharset: 'utf-8'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', companiesRouter);
app.use('/api/v1', stationTypesRouter);
app.use('/api/v1', stationRouter);
app.use('/api/v1', scriptRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack)
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
