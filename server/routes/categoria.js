const express = require('express');
const _ = require('underscore');

let {verficaToken, verficaAdmin} = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

app.get('/categoria', verficaToken, (req, res) => {
	// todas las categorías
	let params = {
		estado: true
	}

	Categoria.find(params, 'name descripcion estado usuario')
		.sort('descripcion')
		.populate('user', 'name email')
		.exec((err, categorias) => {
			if(err){
				res.status(400).json({
					success: false,
					err
				});
			}else{
				res.status(200).json({
					success: true,
					categorias
				});
			}
		});
});

app.get('/categoria/:id', verficaToken, (req, res) => {
	// Mostrar una categoría por id
	//Categoria.findById(...);
	let id = req.params.id;

	Categoria.findById(id)
		.populate('user', 'name email')
		.exec((err, categoria) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			});
		}else if (!categoria){
			res.status(400).json({
				success: false,
				err: {
					message: 'No se ha encontrado la categoría.'
				}
			});
		}else{
			res.json({
				success: true,
				categoria
			});
		}
	});
});

app.post('/categoria', verficaToken, (req, res) => {
	// Crear nueva categoría
	// req.usuario._id
	// Regresa nueva categoría
	let body = req.body;
	let usuario = req.usuario._id;

	let categoria = new Categoria({
		name: body.name,
		descripcion: body.descripcion,
		estado: body.estado,
		user: usuario
	});

	categoria.save((err, categoriaBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			});
		}else if (!categoriaBD){
			res.status(400).json({
				success: false,
				err: {
					message: 'La categoría no se creó.'
				}
			});
		}else{
			res.json({
				success: true,
				categoriaBD
			});
		}
	});
});

app.put('/categoria/:id', verficaToken, (req, res) => {
	// Actualizar descripción de la categoría.

	let id = req.params.id;
	let usuario = req.usuario._id;
	let body = req.body;

	let categoria = {
		name: body.name,
		descripcion: body.descripcion,
		estado: body.estado,
		user: usuario
	};

	//let catModificada = _.pick(categoria,['descripcion','estado','usuario']);

	Categoria.findOneAndUpdate(id, categoria, {new: true, runValidators: true}, (err, categoriaBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			})
		}else if (!categoriaBD){
			res.status(400).json({
				success: false,
				err: {
					message: 'La categoría no se modificó.'
				}
			});
		}else{
			res.json({
				success: true,
				categoriaBD
			});
		}
	});
});

app.delete('/categoria/:id', [verficaToken, verficaAdmin], (req, res) => {
	// Solo un administrador puede borrar una categoría.
	// Cagegoria.findByIdAndRemove()
	let id = req.params.id;

	Categoria.findByIdAndDelete(id, (err, categoriaBD) => {
		if(err){
			res.status(500).json({
				success: false,
				err
			});
		}else if (!categoriaBD){
			res.status(400).json({
				success: false,
				err: {
					message: 'La categoría no se modificó.'
				}
			});
		}else{
			res.json({
				success: true,
				categoriaBD
			})
		}
	});
});

module.exports = app;