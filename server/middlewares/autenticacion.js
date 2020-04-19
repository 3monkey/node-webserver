
const jwt = require('jsonwebtoken');

/** Verrifica  Token */
let verficaToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if(err){
			return res.status(401).json({
				success: false,
				err: {
					message: 'Token no válido.'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});

};

/** Verifica AdminRole */
let verficaAdmin =  (req, res, next) => {
	let user = req.usuario;

	if(user.role === 'ADMIN_ROLE'){
		next();
		return;
	}else{
		return res.json({
			success: false,
			err: {
				message: 'El usuario no es administrador.'
			}
		});
	}

};

/** Verifica Token para imágen */
let verificaTokenImg = (req, res, next) => {
	let token = req.query.token;
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if(err){
			return res.status(401).json({
				success: false,
				err: {
					message: 'Token no válido.'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
}

module.exports = {
	verficaToken,
	verficaAdmin,
	verificaTokenImg
}