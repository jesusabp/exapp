var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

/******/

//https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: `https://www.computrabajo.com.ar`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

//	var http = require('http');

const CronJob = require('cron').CronJob;
// const job = new CronJob('30 * * * *', function(){
const job = new CronJob('*/5 * * * * *', function(){

rp(options)
  .then(($) => {
    var ofertas = $('.sT').text(); 
    ofertas = ofertas.replace('El portal de empleo con más ofertas en Argentina', '');
    ofertas = ofertas.replace('ofertas','');
    ofertas = ofertas.replace(/\n$/, '');
    console.log( ofertas );
   
    insertOfertasMysql(ofertas);
  })
  .catch((err) => {
    console.log(err);
  });

});
job.start();

//http://www.sqlitetutorial.net/sqlite-nodejs/insert/
function insertOfertas(ofertasNow){
  const sqlite3 = require('sqlite3').verbose();
   
  let db = new sqlite3.Database('./db/computrabajo.db');
 
  // insert one row into the langs table
  db.run(`INSERT INTO ofertas(ofertas, datetime) VALUES(?, datetime())`,[ofertasNow], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
 
  // close the database connection
  db.close();
}

function insertOfertasMysql(ofertasNow){

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.30.97.124",
  user: "DBusername",
  password: "DBpass",
  database: "computrabajo"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var values = [ofertasNow, datetime()];

  var sql = "INSERT INTO ofertas (ofertas, datetime) VALUES ?”;
//    var sql = "INSERT INTO ofertas (ofertas, datetime) VALUES (123, 'Blue Village 1')";

  con.query(sql, [values], function (err, result) {
//  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.insertId);
  });
});
}

function insertOfertasMy(ofertasNow){

 var mysql = require('mysql');

 var con = mysql.createConnection({
  host: "172.30.97.124",
  user: "DBusername",
  password: "DBpass",
  database: "computrabajo"
 });

 con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
    var sql = "INSERT INTO ofertas (ofertas, datetime) VALUES (123, 'Blue Village 1')";

  con.query(sql, function (err, result) {
    if (err) throw err;
  });
 });
}

/******/

module.exports = app;
