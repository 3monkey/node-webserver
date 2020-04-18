const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: [true, 'El nombre es necesario.']
	},
	descripcion:{
		type: String,
		required: [true, 'La descripción es obligatoria.']
	},
	estado: {
		type: Boolean,
		default: true
	},
	user: {
		type: Schema.ObjectId, ref: "User"
	}
});

categoriaSchema.methods.toJSON = function(){
	let categoria = this;
	let categoriaObject = categoria.toObject();

	return categoriaObject;
}

//categoriaSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único.'});

module.exports = mongoose.model('Categoria',categoriaSchema);