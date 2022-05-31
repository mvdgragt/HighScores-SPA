var createError = require('http-errors');
var express = require('express');
var moment = require("moment");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const { Pool } = require("pg");
const cors = require('cors');

// Routes
var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var gamesRouter = require('./routes/games');
var gamesAdminRouter = require('./routes/admin/games');
var scoresAdminRouter = require('./routes/admin/score');
var scoresApiRouter = require('./routes/api/scores');
var gamesApiRouter = require('./routes/api/games');
var authRouter = require('./routes/jwtAuth');
var dashboardRouter = require('./routes/dashboard');

var app = express();

app.locals.db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "postgres"
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'shared/layout')

app.use((req, res, next)=>{
  res.locals.moment = moment;
  next();
});

app.use(logger('dev'));
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// routes

app.use('/auth', authRouter);
app.use("/dashboard", dashboardRouter)
app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/games', gamesRouter);
app.use('/admin/games', gamesAdminRouter);
app.use('/admin/score', scoresAdminRouter);
app.use('/api/scores', scoresApiRouter);
app.use('/api/games', gamesApiRouter);

app.post('/api/highscore', (req,res) => {
  res.json(req.body);
  });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

module.exports = app;
