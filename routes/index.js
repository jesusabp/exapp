var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/offers', function(req, res, next) {
  res.render('index', { title: 'Offers' });
  offers();
});

router.get('/cvs', function(req, res, next) {
  res.render('index', { title: 'cvs' });
  cvs();
});

function offers(){
  catchOffers("ar",`https://www.computrabajo.com.ar`,'El portal de empleo con más ofertas en Argentina' );
/*	catchOffers("co",`https://www.computrabajo.com.co`,'Portal del empleo líder en Latinoamérica' );
	catchOffers("mx",`https://www.computrabajo.com.mx`,'Portal del empleo líder en Latinoamérica' );
  catchOffers("pe",`https://www.computrabajo.com.pe`,'Portal del empleo líder en Latinoamérica' );

	catchOffers("cl",`https://www.computrabajo.cl`,'El site de empleo #1 en Latinoamérica' );
	catchOffers("ec",`https://www.computrabajo.com.ec`,'Encuentra las mejores ofertas en Ecuador' );
	catchOffers("ve",`https://www.ve.computrabajo.com`,'Encuentra las mejores ofertas en Venezuela' );
	//catchOffers("cr",`https://www.computrabajo.co.cr`,'Encuentra las mejores ofertas en Costa Rica' );

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
	//catchOffers("es",`https://www.computrabajo.es`,'La web de empleo en español más usada del mundo' );
*/
}

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
		ofertas = ofertas.replace('avisos','');
		ofertas = ofertas.replace('Avisos','');
		ofertas = ofertas.replace(/\n$/, '');
		ofertas = ofertas.replace(',', '');
		ofertas = ofertas.replace('.', '');
		ofertas = ofertas.trim();
    insertOfertas(abbrev, ofertas); //console.log(abbrev +" "+ ofertas + " <-OFERTAS ");
	  })
	  .catch((err) => {
		console.log(err);
	  });
}

function insertOfertas(abbrev, ofertasNow){
	const { Client } = require('pg');

	//var connectionString = "postgres://localhost:5432/d3br4ifgpaaic8"; // to test locally.
	//var connectionString = "postgres://hbhbnjzmnngwtb:7de471fdd4ee9db7471107d22a41d53ed2980f55957fcf7ce8c6c2aed1573405@ec2-35-174-35-242.compute-1.amazonaws.com:5432/d6m43hphpi83av";
	const client = new Client({
		//connectionString, // to test locally.
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false }
	});
	
	client.connect(err => {
	  if (err) {
	    console.error('error connecting', err.stack)
	  } else {
	    console.log('connected')
	    client.end()
	  }
	})
	
	client..query('SELECT NOW()', (err, res) => {
	//client.query('SELECT * FROM ofertas', (err, res) => { // to test the connection.
	//client.query("INSERT INTO ofertas (abbrev, datetime, oferta) VALUES (\'"+abbrev+"\',now(),"+ofertasNow+");", (err, res) => {
			if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
	});
/*	
	client.end(err => {
	  console.log('client has disconnected')
	  if (err) {
	    console.log('error during disconnection', err.stack)
	  }
	})
*/	
}

function cvs(){
  catchCVs("ar",`https://empresa.computrabajo.com.ar`,'La bolsa de trabajo con más avisos en Argentina' );
	catchCVs("co",`https://empresa.computrabajo.com.co`,'Portal del empleo líder en Latinoamérica' );
	catchCVs("mx",`https://empresa.computrabajo.com.mx`,'La web de empleo líder en Latinoamérica' );
	catchCVs("pe",`https://empresa.computrabajo.com.pe`,'Encuentra los mejores avisos en Perú' );

	catchCVs("cl",`https://empresa.computrabajo.cl`,'La bolsa de trabajo con más avisos en Chile' );
	catchCVs("ec",`https://empresa.computrabajo.com.ec`,'Encuentra las mejores ofertas en Ecuador' );
	catchCVs("ve",`https://empresa.ve.computrabajo.com`,'Encuentra las mejores ofertas en Venezuela' );
	catchCVs("cr",`https://empresa.computrabajo.co.cr`,'Encuentra las mejores ofertas en Costa Rica' );

	catchCVs("gt",`https://empresa.computrabajo.com.gt`,'Encuentra las mejores ofertas en Guatemala' );
	catchCVs("sv",`https://empresa.computrabajo.sv`,'Encuentra las mejores ofertas en El Salvador' );
	catchCVs("uy",`https://empresa.computrabajo.com.uy`,'Encuentra los mejores avisos en Uruguay' );
	catchCVs("py",`https://empresa.computrabajo.com.py`,'Encuentra las mejores ofertas en Paraguay' );

	catchCVs("pa",`https://empresa.computrabajo.com.pa`,'Encuentra las mejores ofertas en Panamá' );
	catchCVs("hn",`https://empresa.computrabajo.com.hn`,'Encuentra las mejores ofertas en Honduras' );
	catchCVs("ni",`https://empresa.computrabajo.com.ni`,'Encuentra las mejores ofertas en Nicaragua' );
	catchCVs("do",`https://empresa.computrabajo.com.do`,'Encuentra las mejores ofertas en Republica Dominicana' );

	catchCVs("bo",`https://empresa.computrabajo.com.bo`,'Encuentra las mejores ofertas en Bolivia' );
	catchCVs("cu",`https://empresa.cu.computrabajo.com`,'Encuentra las mejores ofertas en Cuba' );
	catchCVs("pr",`https://empresa.computrabajo.com.pr`,'Encuentra las mejores ofertas en Puerto Rico' );
	//catchCVs("es",`https://empresa.computrabajo.es`,'La web de empleo en español más usada del mundo' );
}

function catchCVs(abbrev, url, moto){
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
		var ofertas = $('.cm-8').text();
		ofertas = ofertas.replace(moto, '');
		ofertas = ofertas.replace('currículums','');
		ofertas = ofertas.replace('hojas de vida','');
		ofertas = ofertas.replace('currículum','');
		ofertas = ofertas.replace(/\n$/, '');
		ofertas = ofertas.replace(',', '');
		ofertas = ofertas.replace(',', '');
		ofertas = ofertas.replace('.', '');
		ofertas = ofertas.replace('.', '');
		ofertas = ofertas.trim();
		insertCVs(abbrev, ofertas); // console.log(abbrev +" "+ ofertas + " <-CVs")
	  })
	  .catch((err) => {
		console.log(err);
	  });
}

function insertCVs(abbrev, cvsNow){
	const { Client } = require('pg');

	var connectionString = "postgres://localhost:5432/d3br4ifgpaaic8"; // to test locally.
	const client = new Client({
		connectionString, // to test locally.
		//connectionString: process.env.DATABASE_URL,
		ssl: false,
	});
	
	client.connect();
	
	client.query("INSERT INTO numcvs (abbrev, datetime, cvs) VALUES (\'"+abbrev+"\',now(),"+cvsNow+");", (err, res) => {
		if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
		client.end();
	});
}

module.exports = router;

