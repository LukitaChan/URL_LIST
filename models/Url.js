const mongoose = require('mongoose');
const { Schema } = mongoose;

//derivado de lo que necesitamos para nuestro schema:
const urlSchema = new Schema({
	origin: {
		type: String,
		unique: true,
		required: true
	},
	shortUrl: {
		type: String,
		unique: true,
		required: true
	}
});

//modelo Url(base datos, esquema a usar)
const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
