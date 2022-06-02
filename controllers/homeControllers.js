//Llamamos al modelo que creamos con mongoose: Url.
const Url = require('../models/Url.js');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
	try {
		const urls = await Url.find().lean();
		res.render('home', { urls: urls });
	} catch (error) {
		console.log(error);
		res.send('Fallo algo');
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
	const { origin } = req.body;
	try {
		const url = new Url({ origin: origin, shortUrl: nanoid(8) });
		//shortUrl tiene valores por defecto.
		await url.save();
		// console.log(url);
		res.redirect('/');
		// res.send(url);
	} catch (error) {
		console.log(error);
		res.send('Error');
	}
};

const eliminarUrl = async (req, res) => {
	const { id } = req.params;
	try {
		await Url.findByIdAndDelete(id);
		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send('error algo fallo');
	}
};

const editarUrlForm = async (req, res) => {
	const { id } = req.params;
	try {
		const url = await Url.findById(id).lean();
		//console.log(url);
		res.render('home', { url });
	} catch (error) {
		console.log(error);
		res.send('Error, algo paso');
	}
};

const editarUrl = async (req, res) => {
	const { id } = req.params;
	const { origin } = req.body;
	try {
		await Url.findByIdAndUpdate(id, { origin: origin });
		res.redirect('/');
	} catch (error) {
		console.log(error);
		res.send('Error, algo paso');
	}
};

const redireccionamiento = async (req, res) => {
	const { shortURL } = req.params;
	console.log(shortURL);
	try {
		const urlDB = await Url.findOne({ shortURL: shortURL });
		res.redirect(urlDB.origin);
	} catch (error) {}
};

module.exports = { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento };
//Exportamos para home.js
