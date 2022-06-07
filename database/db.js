const mongoose = require('mongoose');
//para acceder a las env.
require('dotenv').config();

//desde .env
const clientDB = mongoose
	.connect(process.env.URI)
	.then(m => {
		console.log('Base de Datos Conectada');
		return m.connection.getClient();
	})
	.catch(e => console.log('Fallo la coneccion a DataBase' + e));

module.exports = clientDB;
