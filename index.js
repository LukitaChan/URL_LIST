const express = require('express');
const app = express();
const { create } = require('express-handlebars'); //recibe las configuraciones del handlebar.
const hbs = create({ extname: '.hbs', partialsDir: ['views/components'] });
//conectamos las variables de entorno
require('dotenv').config();
//conectamos la db.js con mongoose a index
require('./database/db.js');

console.log('esto es el BACK-END');

//express-handlebar
app.engine('.hbs', hbs.engine); //motor plantilla
app.set('view engine', '.hbs'); //extencion
app.set('views', './views'); //ubicacion de la extencion.

//middleware. Se ejecuta antes de la respuesta del cliente.
app.use(express.static(__dirname + '/public'));
//habilitamos para req.body por express
app.use(express.urlencoded({ extended: true }));
// importado desde routes.
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Esta activo el puerto ${PORT}`);
});
