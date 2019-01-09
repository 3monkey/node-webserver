const express = require('express');
const User = require('../models/user');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function (req, res) {

	let since = req.query.since || 0;
	let end = req.query.end || 5;
	since = Number(since);
	end = Number(end);

	let params = {
		estado: true
	}

	User.find(params, 'name email role google img')
		.skip(since)
		.limit(end)
		.exec((err, users) => {
			if(err){
				res.status(400).json({
					success: false,
					err
				});
			}

			User.count(params, (err, count) => {			
				res.json({
					success: true,
					count,
					users
				});
			});


		})
});

app.post('/usuario', function (req, res) {
	let body = req.body;
	//console.log(body);
	let user = new User({
		name: body.name,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	user.save((err, userDB) => {
		if(err){
			res.status(400).json({
				success: false,
				err
			});
		}

		//userDB.password = null;

		res.json({
			success:true,
			user: userDB
		})
	});
	/*if(body.nombre === undefined){
		res.status(400).json({
			status: false,
			message: 'El nombre es necesario'
		});
	}else{
	  	res.json({
	  		persona: body
	  	});
	}*/
});

app.put('/usuario/:id', function (req, res) {
	let id = req.params.id;
	let body = _.pick(req.body,['name','email','img','role','estado']);


	User.findByIdAndUpdate(id, body, {new: true, runValidators:true},(err, userDB) => {
		if(err){
			res.status(400).json({
				success: false,
				err
			});
		}

		res.json({
			success:true,
			user: userDB
		});
	});
});

app.delete('/usuario/:id', function (req, res) {
	/*let id = req.params.id;

	User.findByIdAndRemove(id, (err, UserDelete) => {
		if(err){
			res.status(400).json({
				success: false,
				err
			});
		}

		if(!UserDelete){
			res.status(400).json({
				success: false,
				err: { 'message':'Usuario no encontrado.'}
			})
		}

		res.json({
			success: true,
			user: UserDelete
		});
	});*/

	let id = req.params.id;

	User.findByIdAndUpdate(id, {estado: false}, {new: true},(err, userUpdate) => {
		if(err){
			res.status(400).json({
				success: false,
				err
			});
		}

		if(!userUpdate){
			res.status(400).json({
				success: false,
				err: { 'message':'Usuario no encontrado.'}
			})
		}

		res.json({
			success:true,
			user: userUpdate
		});
	});  
});

module.exports = app;
