var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const socketIo = require("socket.io");
const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 8080;
var indexRouter = require('./routes/index');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://env-0915955.hidora.com*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!


io.on("connection", socket => {
  console.log("Client connected");
  setTimeout(function(){
    socket.emit("update", JSON.parse(fs.readFileSync(path.join(__dirname, 'tmp', 'game-data.json'))));
   }, 300);


  socket.on("update", data => {
    console.log("updated");
    fs.writeFile(path.join(__dirname, 'tmp', 'game-data.json'), JSON.stringify(data), function(err) {
      if(err) {
        return console.log(err);
      }
    });
    io.emit("update", data);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
