const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
	let tipo = req.params.tipo;
	let img = req.params.img;

	//let pathImg = `./uploads/${ tipo }/${ img }`;

	let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
	if(fs.existsSync(pathImg)){
		res.sendFile(pathImg);
	}else{
		let noImagePath = path.resolve(__dirname, '../assets/layout_set_logo.png');
		res.sendFile(noImagePath);
	}

});

module.exports = app;