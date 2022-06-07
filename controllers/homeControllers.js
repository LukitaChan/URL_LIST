//Llamamos al modelo que creamos con mongoose: Url.
const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
	//console.log(req.user.id);
	//console.log(req.user);
	try {
		//user viene de Url.js. que se busque cuando user cuente con req.user.id
		const urls = await Url.find({ user: req.user.id }).lean();
		return res.render('home', { urls: urls });
	} catch (error) {
		//console.log(error);
		//return res.send('Fallo algo');
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
	//Aqui nos estamos comunicando con views/home.hbs por medio de main.hbs
	//simulando una DataBase de urls. Se gestiona en home.hbs.
	// 	[{ origin: 'www.google.com', shortUrl: 'abcdefg123' },
	// 	{ origin: 'www.facebook.com', shortUrl: 'abcdefg456' },
	// 	{ origin: 'www.instagram.com', shortUrl: 'abcdefg789' },
	// 	{ origin: 'www.twitter.com', shortUrl: '123456' }
	// ];
};

const agregarUrl = async (req, res) => {
	//console.log(req.user.id);
	const { origin } = req.body;
	try {
		const url = new Url({ origin: origin, shortUrl: nanoid(8), user: req.user.id });
		//shortUrl tiene valores por defecto.
		await url.save();
		req.flash('mensajes', [{ msg: 'Url agregada' }]);
		// console.log(url);
		return res.redirect('/');
		// res.send(url);
	} catch (error) {
		// console.log(error);
		// return res.send('Error');
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const eliminarUrl = async (req, res) => {
	//console.log(req.user.id);
	const { id } = req.params;
	try {
		//await Url.findByIdAndDelete(id);
		const url = await Url.findById(id);
		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url');
		}
		await url.remove();
		req.flash('mensajes', [{ msg: 'Url Eliminada' }]);

		return res.redirect('/');
	} catch (error) {
		// console.log(error);
		// return res.send('error algo fallo');
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const editarUrlForm = async (req, res) => {
	//console.log(req.user.id);
	const { id } = req.params;
	try {
		const url = await Url.findById(id).lean();

		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url');
		}

		return res.render('home', { url });
	} catch (error) {
		// console.log(error);
		// return res.send('Error, algo paso');
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const editarUrl = async (req, res) => {
	//console.log(req.user.id);
	const { id } = req.params;
	const { origin } = req.body;
	try {
		const url = await Url.findById(id);
		if (!url.user.equals(req.user.id)) {
			throw new Error('No es tu url');
		}
		await url.updateOne({ origin });
		req.flash('mensajes', [{ msg: 'Url Editada' }]);
		//await Url.findByIdAndUpdate(id, { origin: origin });
		return res.redirect('/');
	} catch (error) {
		// console.log(error);
		// return res.send('Error, algo paso');
		req.flash('mensajes', [{ msg: error.message }]);
		return res.redirect('/');
	}
};

const redireccionamiento = async (req, res) => {
	const { shortURL } = req.params;
	//console.log(shortURL);
	try {
		const urlDB = await Url.findOne({ shortURL: shortURL });
		return res.redirect(urlDB.origin);
	} catch (error) {
		req.flash('mensajes', [{ msg: 'No existe esta URL configurada' }]);
		return res.redirect('/auth/login');
	}
};

module.exports = {
	leerUrls,
	agregarUrl,
	eliminarUrl,
	editarUrlForm,
	editarUrl,
	redireccionamiento
};
//Exportamos para home.js
