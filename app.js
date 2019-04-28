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
const job = new CronJob('20 * * * *', function(){
//const job = new CronJob('*/15 * * * * *', function(){
	catchOffers("ar",`https://www.computrabajo.com.ar`,'El portal de empleo con más ofertas en Argentina' );
	catchOffers("co",`https://www.computrabajo.com.co`,'El portal de empleo líder en Colombia*' );
	catchOffers("mx",`https://www.computrabajo.com.mx`,'Portal del empleo líder en Latinoamérica' );
	catchOffers("pe",`https://www.computrabajo.com.pe`,'El portal de trabajo líder en Perú*' );

	catchOffers("cl",`https://www.computrabajo.cl`,'El site de empleo #1 en Latinoamérica' );
	catchOffers("ec",`https://www.computrabajo.com.ec`,'Encuentra las mejores ofertas en Ecuador' );
	catchOffers("ve",`https://www.ve.computrabajo.com`,'Encuentra las mejores ofertas en Venezuela' );
	catchOffers("cr",`https://www.computrabajo.co.cr`,'Encuentra las mejores ofertas en Costa Rica' );

	catchOffers("gt",`https://www.gt.computrabajo.com`,'Encuentra las mejores ofertas en Guatemala' );
	catchOffers("sv",`https://www.sv.computrabajo.com`,'Encuentra las mejores ofertas en El Salvador' );
	catchOffers("uy",`https://www.computrabajo.com.uy`,'Encuentra los mejores avisos en Uruguay' );
	catchOffers("py",`https://www.computrabajo.com.py`,'Encuentra las mejores ofertas en Paraguay' );

	catchOffers("pa",`https://www.computrabajo.com.pa`,'Encuentra las mejores ofertas en Panamá' );
	catchOffers("hn",`https://www.computrabajo.com.hn`,'Encuentra las mejores ofertas en Honduras' );
	catchOffers("ni",`https://www.computrabajo.com.ni`,'Encuentra las mejores ofertas en Nicaragua' );
	catchOffers("do",`https://www.computrabajo.com.do`,'Encuentra las mejores ofertas en Republica Dominicana' );
	
	catchOffers("bo",`https://www.computrabajo.com.bo`,'Encuentra las mejores ofertas en Bolivia' );
	catchOffers("cu",`https://www.cu.computrabajo.com`,'Encuentra las mejores ofertas en Cuba' );
	catchOffers("pr",`https://www.computrabajo.com.pr`,'Encuentra las mejores ofertas en Puerto Rico' );
	catchOffers("es",`https://www.computrabajo.es`,'La web de empleo en español más usada del mundo' );
});
job.start();

function catchOffers(abbrev, url, moto){
	//https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
	const rp = require('request-promise');
	const cheerio = require('cheerio');
	const options = {
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
		ofertas = ofertas.replace(',', '');
		ofertas = ofertas.replace('.', '');
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
//	  console.log("Connected!");
	  var sql = "INSERT INTO ofertas (abbrev, datetime, oferta) VALUES (\""+abbrev+"\",now(),"+ofertasNow+");";
	  con.query(sql, function (err, result) {
		if (err){ console.log("ERROR with: "+sql);
			throw err;
		}
//		console.log("INSERTED "+sql);
	  });
	});
}

/******/

module.exports = app;
