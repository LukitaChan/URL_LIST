const express = require('express');
//Modulo de express para seciones.
const session = require('express-session');
//Flash es un tipo de secion que solo vive una vez.
const flash = require('connect-flash');
//MongoDB session store for Connect and Express written in Typescript.
const MongoStore = require('connect-mongo');
//Acceso de dominios a la web
const cors = require('cors');
//Passport es para autentificaciones (rutas protegidas)
const passport = require('passport');
//middleware para verificar que nuestra info sea de nuestra web (protecciones).
const csrf = require('csurf');
//recibe las configuraciones del handlebar.
const { create } = require('express-handlebars');

const User = require('./models/User.js');
require('dotenv').config();
//conectamos la db.js con mongoose a index
//require('./database/db.js');   Ajuste.
const clientDB = require('./database/db');

const app = express();

//CORS
const corsOptions = {
	credentiales: true,
	origin: process.env.PATHHEROKU || '*',
	methods: ['GET', 'POST']
};
app.use(cors());

app.set('trust proxy', 1);

//Middleware para crear seciones en el sitio web. Queda almacenada en la memoria de express (memoria).
app.use(
	session({
		secret: process.env.SECRETSESION,
		resave: false,
		saveUninitialized: false,
		name: 'sesion-user',
		store: MongoStore.create({
			clientPromise: clientDB,
			dbName: process.env.DBNAME
		}),
		cookie: {
			secure: process.env.MODMO === 'production',
			maxAge: 30 * 24 * 60 * 60 * 1000
		}
	})
);
//Middleware para crear sesion con flash. Flash sirve para dar alertas.
app.use(flash());
//Middleware para autentificaciones en sesiones. Passport sirve para rutas protegidas.
app.use(passport.initialize());
app.use(passport.session());

//crear sesion con passport
passport.serializeUser((user, done) => done(null, { id: user._id, userName: user.userName }));
//req.user
//cada que se refresque o actualize sesion
passport.deserializeUser(async (user, done) => {
	//verificar db para verificar si existe el usuario?
	const userDB = await User.findById(user.id);
	return done(null, { id: userDB._id, userName: userDB.userName });
});

/* //mensaje-flash es la ruta que va a recibir el mensaje.
app.get('/mensaje-flash', (req, res) => {
	res.json(req.flash('mensaje'));
});
app.get('/crear-mensaje', (req, res) => {
	req.flash('mensaje', 'Este es un msg de error');
	res.redirect('/mensaje-flash');
}); */
/* app.get('/ruta-protegida', (req, res) => {
	res.json(req.session.usuario || 'Sin sesion de usuario');
});
app.get('/crear-sesion', (req, res) => {
	(req.session.usuario = 'Galleta'), res.redirect('/ruta-protegida');
});
app.get('/eliminar-sesion', (req, res) => {
	req.session.destroy();
	res.redirect('/ruta-protegida');
}); */

const hbs = create({ extname: '.hbs', partialsDir: ['views/components'] });
//conectamos las variables de entorno

//console.log('esto es el BACK-END');

//express-handlebar
app.engine('.hbs', hbs.engine); //motor plantilla
app.set('view engine', '.hbs'); //extencion
app.set('views', './views'); //ubicacion de la extencion.

//middleware. Se ejecuta antes de la respuesta del cliente.
app.use(express.static(__dirname + '/public'));
//habilitamos para req.body por express
app.use(express.urlencoded({ extended: true }));

//middleware csurf: protecciones.
app.use(csrf());

//middleware para token (seguridad)
app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	res.locals.mensajes = req.flash('mensajes');
	next();
});

// importado desde routes.
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Esta activo el puerto ${PORT}`);
});
