// modelo para la coleccion usuarios
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');




const hospitalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' }
    
}, { collection: 'hospitales'});

// add a validator 
usuarioSchema.plugin( uniqueValidator , { message: 'El {PATH} debe ser unico'});

// User model based on hospitalSchema
module.exports = mongoose.model('hospital', hospitalSchema);

