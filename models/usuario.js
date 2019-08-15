// modelo para la coleccion usuarios
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//
const rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido'
};


const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    }

});

// add a validator 
usuarioSchema.plugin( uniqueValidator , { message: 'El {PATH} debe ser unico'});

// User model based on userSchema
module.exports = mongoose.model('usuarios', usuarioSchema);

