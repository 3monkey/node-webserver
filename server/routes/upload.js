const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Producto = require('../models/producto'); 
const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:type/:id', (req, res) => {
	if(!req){
		return res.satatus(400).json({
			success: false,
			err: {
				message: "No se ha seleccionado ningún archivo"
			}
		});
	}

	let type = req.params.type;
	let id = req.params.id;
	let Ufile = req.files.archivo;
	let nameFile = Ufile.name.split('.');
	let extensionFile = nameFile[nameFile.length -1]

	// Validar extensiones, Extensiones permitidas.
	let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

	if(extensiones.indexOf(extensionFile) < 0){
		return res.status(400).json({
			success: false,
			err: {
				message: 'Las extensiones permitidas son: ' + extensiones.join(', ')
			}
		});
	}

	// VAlidar tipos
	let tipos = ['productos', 'users'];
	if(tipos.indexOf(type) < 0){
		return res.status(400).json({
			success: false,
			err: {
				message: 'Los tipos permitidss son: ' + tipos.join(', ')
			}
		});
	}

	// Cambiar el nombre al archivo
	let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionFile }`;

	Ufile.mv(`uploads/${ type }/${ nombreArchivo }`, (err) => {
	    if (err){
	    	return res.status(500).json({
	    		success: false,
	    		err
	      	});
	    }else{
	    	switch(type){
	    		case 'users':
	    			imagenUser(id, res, nombreArchivo);
	    			break;
	    		case 'productos':
	    			imagenProducto(id, res, nombreArchivo);
	    			break;
	    	}

	    	// La imagen se cargó.
	    	/*res.json({
	    		success: true,
	    		message: 'Arvhico subido correctamente.'
	    	});*/
	    }
	});
});

function imagenUser(id, res, nombreArchivo){
	User.findById(id, (err, userDB) => {
		if(err){
			borrarImagen(nombreArchivo, 'users' );
			res.status(500).json({
					success: false,
					err
			});
		}else if(!userDB){
			borrarImagen(nombreArchivo, 'users' );
			res.status(400).json({
				success: false,
				err: {
					message: 'El usuario no existe.'
				}
			});
		}else{
			borrarImagen(userDB.img, 'users' );
			userDB.img = nombreArchivo;
			userDB.save((err, userSave) => {
				res.json({
					success: true,
					user: userSave,
					img: nombreArchivo
				})
			});
		}
	});
}

function imagenProducto(id, res, nombreArchivo){
	Producto.findById(id, (err, productoDB) => {
		if(err){
			borrarImagen(nombreArchivo, 'productos' );
			res.status(500).json({
					success: false,
					err
			});
		}else if(!productoDB){
			borrarImagen(nombreArchivo, 'productos' );
			res.status(400).json({
				success: false,
				err: {
					message: 'El producto no existe.'
				}
			});
		}else{
			borrarImagen(productoDB.img, 'productos' );
			productoDB.img = nombreArchivo;
			productoDB.save((err, productoSave) => {
				res.json({
					success: true,
					producto: productoSave,
					img: nombreArchivo
				})
			});
		}
	})
}

function borrarImagen(img, tipo){
	let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
	if(fs.existsSync(pathImg)){
		fs.unlinkSync(pathImg);
	}
}

module.exports = app;