const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	//Aqui nos estamos comunicando con views/home.hbs por medio de main.hbs
	//simulando una DataBase de urls. Se gestiona en home.hbs.
	const urls = [
		{ origin: 'www.google.com', shortUrl: 'abcdefg123' },
		{ origin: 'www.facebook.com', shortUrl: 'abcdefg456' },
		{ origin: 'www.instagram.com', shortUrl: 'abcdefg789' },
		{ origin: 'www.twitter.com', shortUrl: '123456' }
	];
	res.render('home', { urls: urls });
});

module.exports = router;
//Esto se importara a index.js en un midleware.
