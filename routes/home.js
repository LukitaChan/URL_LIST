const express = require('express');
const {
	leerUrls,
	agregarUrl,
	eliminarUrl,
	editarUrlForm,
	editarUrl,
	redireccionamiento
} = require('../controllers/homeControllers');
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController');
const urlValidar = require('../middleware/urlValida');
const verificarUser = require('../middleware/verificarUser');

const router = express.Router();

router.get('/', verificarUser, leerUrls);
router.post('/', verificarUser, urlValidar, agregarUrl);
router.get('/eliminar/:id', verificarUser, eliminarUrl);
router.get('/editar/:id', verificarUser, editarUrlForm);
router.post('/editar/:id', verificarUser, urlValidar, editarUrl);

//Personalizar perfiles de usuario.
router.get('/perfil', verificarUser, formPerfil);
router.post('/perfil', verificarUser, editarFotoPerfil);

//Pendiente
router.get('/:shortURL', redireccionamiento);

module.exports = router;
//Esto se importara a index.js en un midleware.
