var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

/* START****************/
offers();
/* END *****************/

});

function offers(){
  catchOffers("ar",`https://www.computrabajo.com.ar`,'El portal de empleo con más ofertas en Argentina' );
	catchOffers("co",`https://www.computrabajo.com.co`,'Portal del empleo líder en Latinoamérica' );
	catchOffers("mx",`https://www.computrabajo.com.mx`,'Portal del empleo líder en Latinoamérica' );
  catchOffers("pe",`https://www.computrabajo.com.pe`,'Portal del empleo líder en Latinoamérica' );

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
	const client = new Client({
		//connectionString, // to test locally.
		connectionString: process.env.DATABASE_URL,
		ssl: false,
	});
	
	client.connect();

	//client.query('SELECT * FROM ofertas', (err, res) => { // to test the connection.
	client.query("INSERT INTO ofertas (abbrev, datetime, oferta) VALUES (\'"+abbrev+"\',now(),"+ofertasNow+");", (err, res) => {
			if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
		client.end();
	});
}

module.exports = router;
