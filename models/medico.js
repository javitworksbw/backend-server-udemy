// modelo para la coleccion usuarios
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');




const medicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'hospitales', required: true }
    
}, { collection: 'medicos'});

// add a validator 
medicoSchema.plugin( uniqueValidator , { message: 'El {PATH} debe ser unico'});

// User model based on hospitalSchema
module.exports = mongoose.model('medicos', medicoSchema);

