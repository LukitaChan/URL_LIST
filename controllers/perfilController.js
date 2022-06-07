const formidable = require('formidable');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

module.exports.formPerfil = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		return res.render('perfil', { user: req.user, imagen: user.imagen });
	} catch (error) {
		req.flash('mensajes', [{ msg: 'Error al leer User' }]);
		return res.redirect('(perfil');
	}
};

module.exports.editarFotoPerfil = async (req, res) => {
	//console.log(req.user)
	//return res.json({ ok: true });
	const form = new formidable.IncomingForm();
	form.maxFileSize = 50 * 1024 * 1024; //5mb

	form.parse(req, async (err, fields, files) => {
		try {
			if (err) {
				throw new Error('fallo la subida de pic/formidable');
			}
			//console.log(fields);
			//console.log(files);

			const file = files.myFile;
			if (file.originalFilename === '') {
				throw new Error('Agregar IMG');
			}

			/* 			if (!(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png')) {
				throw new Error('Agregar IMG jpeg o png');
			} */

			const imageTypes = ['image/jpeg', 'image/png'];

			if (!imageTypes.includes(file.mimetype)) {
				throw new Error('Agregar IMG jpeg o png');
			}

			if (file.size > 50 * 1024 * 1024) {
				throw new Error('Agregar IMG menos a 5mb');
			}

			//Guardar imagen en el servidor.
			const extension = file.mimetype.split('/')[1]; //javascript
			const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`);

			//reasignar rutas. Para guardar la imagen.
			fs.renameSync(file.filepath, dirFile);

			//redireccionando la imagen con Jimp.
			const image = await Jimp.read(dirFile);
			image.resize(200, 200).quality(90).writeAsync(dirFile);

			const user = await User.findById(req.user.id);
			user.imagen = `${req.user.id}.${extension}`;
			await user.save(); //monggose

			//console.log(dirFile);

			req.flash('mensajes', [{ msg: 'Imagen Actualizada' }]);
		} catch (error) {
			console.log(error);
			req.flash('mensajes', [{ msg: error.message }]);
		} finally {
			return res.redirect('/perfil');
		}
	});
};
//exportar a home.js
