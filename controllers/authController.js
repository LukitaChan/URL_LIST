const User = require('../models/User');
const { validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
//const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); //Para correos autentificacion.
require('dotenv').config();

const registerForm = (req, res) => {
	return res.render('register');
};

const loginForm = (req, res) => {
	//venimos del res.redirect de loginUser. Esto deberia poder leerse en el login.hbs. mensajes manda el mensaje de error.
	return res.render('login');
};

const registerUser = async (req, res) => {
	//validationResult para validar la data que ingresa en registor.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//return res.json(errors);
		//Validacion de registro.
		req.flash('mensajes', errors.array());
		return res.redirect('/auth/register');
	}

	//console.log(req.body);

	const { userName, email, password } = req.body;
	try {
		let user = await User.findOne({ email: email });
		if (user) throw new Error('Ya existe User');

		user = new User({ userName, email, password, tokenConfirm: nanoid() });
		await user.save();

		//Nodemailer par enviar email con confirmacion de cuenta.
		const transport = nodemailer.createTransport({
			host: 'smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: process.env.userEmail,
				pass: process.env.passEmail
			}
		});

		//Mailtrap
		await transport.sendMail({
			from: '"Lukarita" <luka@example.com>', // sender address
			to: user.email, // list of receivers
			subject: 'Verifica tu cuenta correo', // Subject line
			//html: `<a href="http://localhost:5000/auth/confirmar/${user.tokenConfirm}"/>Verifica aqui</a>`
			// html body
			html: `<a href="${process.env.PATHHEROKU} || 'http://localhost:5000'}/auth/confirmar/${user.tokenConfirm}"/>Verifica aqui</a>` // html body
		});

		req.flash('mensajes', [{ msg: 'Revisar email y validar acount' }]);
		return res.redirect('/auth/login');
		//res.render('login');
		//res.json(user);
	} catch (error) {
		//res.json({ error: error.message });
		//catch para la validacion en caso de no haber registro.
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/register');
	}
};

const confirmarCuenta = async (req, res) => {
	const { token } = req.params;
	try {
		const user = await User.findOne({ tokenConfirm: token });
		if (!user) throw new Error('No existe este User'); //si NO hay usuario

		//si EXISTE usuario.
		user.cuentaConfirmada = true;
		user.tokenConfirm = null;

		await user.save();

		req.flash('mensajes', [{ msg: 'Acount Verificada' }]);
		return res.redirect('/auth/login');
	} catch (error) {
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
		//res.json({ error: error.message });
	}
};

const loginUser = async (req, res) => {
	//validationResult para validar la data que ingresa en login.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		//el mensaje se va a un array en errors.array.
		req.flash('mensajes', errors.array());
		//return res.json(errors.array());
		return res.redirect('/auth/login');
		//como el proceso flash solo se hace una vez, cuando se haga el redirect a 'login' vamos a loginForm.
	}

	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error('No existe este email'); //si NO hay email

		if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta'); //si hay validacion de cuenta.

		if (!(await user.comparePassword(password))) throw new Error('Contraseña no correcta');

		//para el login, donde se hace el redirect en caso de no tener sesion (verificarUser.js). Crea sesion usuario usando passport.
		req.login(user, function (err) {
			if (err) throw new Error('Error al crear sesion');
			return res.redirect('/');
		});
		//Errorres de consulta de data en la DB.
	} catch (error) {
		//console.log(error);
		//el mensaje se va a un array que es un objeto con la prop msg.
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/auth/login');
		//como el proceso flash solo se hace una vez, cuando se haga el redirect a 'login' vamos a loginForm.
		//res.send(error.message);
	}
};

const cerrarSesion = function (req, res, next) {
	//req.logout viene de passport
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		return res.redirect('/auth/login');
	});
};

module.exports = { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion };
