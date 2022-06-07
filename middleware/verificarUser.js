//middleware para verificar si el usuario tiene secion activa.
module.exports = (req, res, next) => {
	//si hay sesion verificada y activa.
	if (req.isAuthenticated()) {
		return next();
	}
	//a login para que inicie sesion.
	res.redirect('/auth/login');
};
// se importa en home.js
