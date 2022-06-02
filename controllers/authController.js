const User = require('../models/User');
const { nanoid } = require('nanoid');
//const bcrypt = require('bcryptjs');

const registerForm = (req, res) => {
	res.render('register');
};

const registerUser = async (req, res) => {
	console.log(req.body);
	const { userName, email, password } = req.body;
	try {
		let user = await User.findOne({ email: email });
		if (user) throw new Error('Ya existe User');

		user = new User({ userName, email, password, tokenConfirm: nanoid() });
		await user.save();

		//enviar email con confirmacion de cuenta
		res.redirect('/auth/login');
		//res.render('login');
		//res.json(user);
	} catch (error) {
		res.json({ error: error.message });
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

		res.redirect('/auth/login');
	} catch (error) {
		res.json({ error: error.message });
	}
};

const loginForm = (req, res) => {
	res.render('login');
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error('No existe este email'); //si NO hay email

		if (!user.cuentaConfirmada) throw new Error('Falta confirmar cuenta'); //si hay validacion de cuenta.

		if (!(await user.comparePassword(password))) throw new Error('Contraseña no correcta');

		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send(error.message);
	}
};

module.exports = { loginForm, registerForm, registerUser, confirmarCuenta, loginUser };
