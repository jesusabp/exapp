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

const CronJob = require('cron').CronJob;
// const job = new CronJob('30 * * * *', function(){
const job = new CronJob('*/15 * * * * *', function(){
	catchOffers("ar",`https://www.computrabajo.com.ar`,'El portal de empleo con más ofertas en Argentina' );
	catchOffers("co",`https://www.computrabajo.com.co`,'El portal de empleo líder en Colombia*' );
	catchOffers("mx",`https://www.computrabajo.com.mx`,'Portal del empleo líder en Latinoamérica' );
});
job.start();

function catchOffers(abbrev, url, moto){
	//https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
	const rp = require('request-promise');
	const cheerio = require('cheerio');
	const options = {
//	  uri: `https://www.computrabajo.com.ar`,
	uri: url,
	  transform: function (body) {
		return cheerio.load(body);
	  }
	};

	rp(options)
	  .then(($) => {
		var ofertas = $('.sT').text(); 
		ofertas = ofertas.replace(moto, '');
		ofertas = ofertas.replace('ofertas','');
		ofertas = ofertas.replace(/\n$/, '');
		ofertas = ofertas.trim();
		insertOfertasMysql(abbrev, ofertas); // console.log(abbrev +" "+ ofertas)
	  })
	  .catch((err) => {
		console.log(err);
	  });
}

function insertOfertasMysql(abbrev, ofertasNow){
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "172.30.177.67",
	  user: "DBusername",
	  password: "DBpass",
	  database: "empleo"
	});

	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	  var sql = "INSERT INTO ofertas (abbrev, datetime, oferta) VALUES (\""+abbrev+"\",now(),"+ofertasNow+");";
	  con.query(sql, function (err, result) {
		if (err){ console.log("ERROR with: "+sql);
throw err;
		}
		console.log("INSERTED "+sql);
	  });
	});
}

/******/

module.exports = app;
