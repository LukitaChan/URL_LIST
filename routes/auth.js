const express = require('express');
//express-validator is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.
const { body } = require('express-validator');
const {
	loginForm,
	registerForm,
	registerUser,
	confirmarCuenta,
	loginUser,
	cerrarSesion
} = require('../controllers/authController');
const router = express.Router();

router.get('/register', registerForm);
//Validadores para los datos de registro. Datos de register.hbs
router.post(
	'/register',
	[
		body('userName', 'Ingrese nombre valido').trim().notEmpty().escape(),
		body('email', 'Inngrese un email valido').trim().isEmail().normalizeEmail(),
		body('password', 'Ingrese una password +6 characters')
			.trim()
			.isLength({ min: 6 })
			.escape()
			.custom((value, { req }) => {
				if (value !== req.body.repassword) {
					throw new Error('Las password no coindicen');
				} else {
					return value;
				}
			})
	],
	registerUser
);
router.get('/confirmar/:token', confirmarCuenta);
router.get('/login', loginForm);

//Validadiones de LoginUser. Datos de login.hbs
router.post(
	'/login',
	[
		body('email', 'Inngrese un email valido').trim().isEmail().normalizeEmail(),
		body('password', 'Ingrese una password +6 characters').trim().isLength({ min: 6 }).escape()
	],
	loginUser
);

router.get('/logout', cerrarSesion);

// router.get('/login', (req, res) => {
// 	res.render('login');
// 	//Aqui nos estamos comunicando con views/login.hbs por medio de main.hbs
// });

module.exports = router;
