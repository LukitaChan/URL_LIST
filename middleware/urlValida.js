const { URL } = require('url');
const urlValidar = (req, res, next) => {
	try {
		const { origin } = req.body;
		const urlFrontend = new URL(origin);
		if (urlFrontend.origin !== 'null') {
			//Para verificar si lo que se agrega es http o https
			if (urlFrontend.protocol === 'http:' || urlFrontend.protocol === 'https') {
				return next();
			}
		}
		throw new Error('No valido');
	} catch (error) {
		//console.log(error)
		//return res.redirect('/');
		return res.send('url no valida');
	}
};

module.exports = urlValidar;
