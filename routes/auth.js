const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
	res.render('login');
	//Aqui nos estamos comunicando con views/login.hbs por medio de main.hbs
});

module.exports = router;
