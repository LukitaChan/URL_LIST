const express = require('express');
const app = express();
const { create } = require('express-handlebars'); //recibe las configuraciones del handlebar.
const hbs = create({ extname: '.hbs', partialsDir: ['views/components'] });
const port = 5000;

console.log('esto es el BACK-END');

//express-handlebar
app.engine('.hbs', hbs.engine); //motor plantilla
app.set('view engine', '.hbs'); //extencion
app.set('views', './views'); //ubicacion de la extencion.

//middleware. Se ejecuta antes de la respuesta del cliente.
app.use(express.static(__dirname + '/public'));
// importado desde routes.
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

app.listen(port, () => {
	console.log(`Esta activo el puerto ${port}`);
});
