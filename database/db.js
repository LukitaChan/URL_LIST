const mongoose = require('mongoose');

//desde .env
mongoose
	.connect(process.env.URI)
	.then(() => console.log('DATABASE Conectada'))
	.catch(e => console.log('Fallo la coneccion a DataBase'));
