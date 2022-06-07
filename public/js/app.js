console.log('Hola soy app.js, el FRONT-END');

document.addEventListener('click', e => {
	if (e.target.dataset.short) {
		//console.log('Existe');              http://localhost:5000/
		const url = `${window.location.origin}/${e.target.dataset.short}`;

		navigator.clipboard
			.writeText(url)
			.then(() => {
				console.log('Texto copiado a clipboard');
			})
			.catch(err => {
				console.log('Algo salio mal', err);
			});
	}
});
