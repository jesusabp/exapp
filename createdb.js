const sqlite3 = require('sqlite3').verbose();
 
let db = new sqlite3.Database('./db/computrabajo.db');
 
db.run('CREATE TABLE ofertas(ID INTEGER PRIMARY KEY AUTOINCREMENT, datetime text, ofertas REAL)');
 
db.close();
