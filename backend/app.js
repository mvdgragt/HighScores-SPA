var createError = require("http-errors");
var express = require("express");
var moment = require("moment");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
const { Pool } = require("pg");
const cors = require("cors");
// var morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Routes
var indexRouter = require("./routes/index");
var searchRouter = require("./routes/search");
var gamesRouter = require("./routes/games");
var gamesAdminRouter = require("./routes/admin/games");
var scoresAdminRouter = require("./routes/admin/score");


// API
var authApiRouter = require("./routes/api/auth");
var gamesApiRouter = require("./routes/api/games_new");
// var scoresApiRouter = require("./routes/api/scores");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Highscores API",
      version: "1.0.0",
      description: "A simple Express Highscores API"
    },
    
  },
  apis: ["./routes/api/*.js"],
};


const specs = swaggerJSDoc(options);
var app = express();

app.locals.db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "postgres",
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "shared/layout");

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

app.use(logger("dev"));
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// routes

app.use("/", indexRouter);
app.use("/search", searchRouter);
app.use("/games", gamesRouter);
app.use("/admin/games", gamesAdminRouter);
app.use("/admin/score", scoresAdminRouter);

// API
app.use("/api/auth", authApiRouter);
app.use("/api/games", gamesApiRouter);
// app.use("/api/scores", scoresApiRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.post("/api/highscore", (req, res) => {
  res.json(req.body);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use("/", indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
