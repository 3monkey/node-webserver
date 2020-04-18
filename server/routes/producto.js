const express = require('express');

const {verficaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

// Obtener todos los producto
app.get('/producto', verficaToken, (req, res) => {
	// traer todos los productos
	// populate usuario categoria
	// paginado
	let desde = req.query.desde || 0;
	desde = Number(desde);
	let params = {
		disponible: true
	}

	Producto.find(params)
		.skip(desde)
		.limit(5)
		.sort('name')
		.populate('user','name email')
		.populate('categoria','name descripcion')
		.exec((err, productos) => {
			if(err){
				res.status(500).json({
					success: false,
					err
				});
			}else{
				res.json({
					success: true,
					productos
				})
			}
		});
});


// Obtener producto por id
app.get('/producto/:id', verficaToken, (req, res) => {
	// populate usuario categoria
	// paginado

	let id = req.params.id;

	Producto.findById(id)
		.populate('user','name email')
		.populate('categoria','name descripcion')
		.exec((err, productoBD) => {
			if(err){
				res.status(500).json({
					success: false,
					err
				});
			}else if(!productoBD){
				res.status(400).json({
					success: false,
					err: {
						message: 'No se ha encontrado el producto.'
					}
				});
			}else{
				res.json({
					success: true,
					productoBD
				})
			}
		});
});

// Buscar productos
app.get('/producto/search/:item', verficaToken, (req, res) => {
	let item = req.params.item;
	let regex = new RegExp(item, 'i');
	let params = {
		name: regex
	};

	Producto.find(params)
		.populate('user','name email')
		.populate('categoria','name descripcion')
		.exec((err, productos) => {
			if(err){
				res.status(500).json({
					success: false,
					err
				});
			}else{
				res.json({
					success: true,
					productos
				})
			}
		});
});

// Crear un nuevo producto
app.post('/producto', verficaToken, async (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado
	let body = req.body;
	let usuario = req.usuario._id;
	/*let categoria = await getCategoriaByName(body.categoria)
		.catch(e => {
			return res.status(403).json({
				success: false,
				err: e
			});
		});*/

	let producto = new Producto({
		name: body.name,
		descripcion: body.descripcion,
		precioUni: body.precioUni,
		disponible: body.disponible,
		user: usuario,
		categoria: body.categoria
	});

	producto.save((err, productoBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			})
		}else if(!productoBD){
			res.satus(400).json({
				success: false,
				err: {
					message: 'No se ha creado el producto.'
				}
			})
		}else{
			res.status(201).json({
				success: true,
				productoBD
			})
		}
	});
});

// Modificar un producto
app.put('/producto/:id', verficaToken, async (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado

	let id = req.params.id;
	let body = req.body;
	let usuario = req.usuario._id;
	//let categoria = await getCategoriaByName(body.categoria);

	Producto.findById(id, (err, productoDB) => {
		if(err){
			return res.status(500).json({
				success: false,
				err
			});
		}else if(!productoDB){
			return res.status(400).json({
				success: false,
				err: {
					message: 'El producto no existe.'
				}
			});
		}else{
			productoDB.name = body.name;
			productoDB.descripcion = body.descripcion;
			productoDB.precioUni = body.precioUni;
			productoDB.disponible = body.disponible;
			productoDB.user = usuario;
			productoDB.categoria = body.categoria;

			productoDB.save((err, productoEditado) => {
				if(err){
					return res.status(500).json({
						success: false,
						err
					});
				}else{
					res.json({
						success: true,
						productoEditado
					})
				}
			})
		}
	});

	/*let producto = new Producto({
		name: body.name,
		descripcion: body.descripcion,
		precioUni: body.precioUni,
		disponible: body.disponible,
		user: usuario,
		categoria: body.categoria
	});

	Producto.findOneAndUpdate(id, producto, {new: true, runValidators: true}, (err, productoBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			})
		}else if(!productoBD){
			res.satus(400).json({
				success: false,
				err: {
					message: 'No se ha modificado el producto.'
				}
			})
		}else{
			res.json({
				success: true,
				productoBD
			})
		}
	});*/
});

// Anular un producto
app.delete('/Producto/:id', verficaToken, (req, res) => {
	// Modificar estado

	let id = req.params.id;

	Producto.findById(id, (err, productoDB) => {
		if(err){
			return res.status(500).json({
				success: false,
				err
			});
		}else if(!productoDB){
			return res.status(400).json({
				success: false,
				err: {
					message: 'El producto no existe.'
				}
			});
		}else{

			productoDB.disponible = false;

			productoDB.save((err, productoAnulado) => {
				if(err){
					return res.status(500).json({
						success: false,
						err
					});
				}else{
					res.json({
						success: true,
						productoAnulado,
						message: 'Producto Anulado.'
					})
				}
			})
		}
	});

	/*Producto.findOneAndUpdate(id,{disponible: false}, {new: true, runValidators: true}, (err, productoBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			})
		}else if(!productoBD){
			res.satus(400).json({
				success: false,
				err: {
					message: 'No se ha anulado el producto.'
				}
			})
		}else{
			res.json({
				success: true,
				productoBD
			})
		}
	});*/
});

async function getCategoriaByName(name){
	let params = {
		name: name
	};
	Categoria.findOne(params, (err, categoriaBD) => {
		if(err){
			return err;
		}else if (!categoriaBD){
			return false;
		}else{
			return categoriaBD;
		}
	});

}

module.exports = app;