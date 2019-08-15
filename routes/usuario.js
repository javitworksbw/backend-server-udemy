const express               = require('express');
const bcrypt                = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const SEED                  = require('../config/config').SEED;  
const mdAuth                = require('../middlewares/auth');

const app = express();


// User model
const Usuario = require('../models/usuario');

// ==========================================================
// GET /usuario    ( obtener todos los usuarios )
// ==========================================================
app.get( '/', (req, res ) => {

    // Usando el modelo de mongoose
    Usuario.find({ }, 'nombre email img role' )
    .exec(
            (err, usuarios)=> {
                
                if ( err ) {
                    return res.status(500).json({
                        ok: false , 
                        message: 'Error loading user',
                        errors: err
                    });    
                }

                res.status(200).json({
                    ok: true , 
                    usuarios: usuarios
                });

            }
        );

    

});



// ==========================================================
// PUT /usuario/:id    ( actualizar usuario por id)
// ==========================================================
app.put( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    let id      = req.params.id;
    let body    = req.body;
    

    // Usando el modelo de mongoose
    Usuario.findById( id , (err, usuarioEncontrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                mensaje: 'Error al buscar usuario', 
                errors: err,
                usuario: []
            });    
        }

        if (!usuarioEncontrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                mensaje: 'El usuario con el id ' + id + ' no existe', 
                errors: err
                
            });
        }

        // update field values
        usuarioEncontrado.nombre    = body.nombre         ;
        usuarioEncontrado.email     = body.email          ;
        usuarioEncontrado.role      = body.role           ;


        // saves into the database
        usuarioEncontrado.save( (err, usuarioGuardado ) => {

            if ( err ) {

                // 400 - Bad request error
                return res.status(400).json({
                    ok: false , 
                    message: 'Error updating user',
                    errors: err
                });    
            }

            // hides the password to be sent
            usuarioGuardado.password = ':)';

            // success code (200)
            res.status(200).json({
                ok: true , 
                usuario: usuarioGuardado
            });

        });


    });

});


// ==========================================================
// GET /usuario/:id    ( obtener usuario por id)
// ==========================================================
app.get( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    const body = req.body;

    // Usando el modelo de mongoose
    Usuario.find({ _id: req.params.id }, (err, usuarioEncontrado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error getting user',
                errors: err
            });    
        }

        // http successfull code  (200)
        res.status(200).json({
            ok: true , 
            usuario: usuarioEncontrado
        });

    });

});


// ==========================================================
// POST /usuario    ( obtener todos los usuarios )
// ==========================================================
app.post( '/', mdAuth.auth_verify_token, (req, res ) => {

    const body = req.body;

    // encrypt user password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(body.password, salt);
    // Store hash in your password DB.

    // basado en el modelo de mongoose
    const usuario = new Usuario({
        nombre: body.nombre ,
        email: body.email ,
        password: hash,
        img: body.img,
        role: body.role
    });
    
    // saves into the database
    usuario.save( (err, usuarioGuardado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error saving user',
                errors: err
            });    
        }

        // object created code (201)
        res.status(201).json({
            ok: true , 
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});






// ==========================================================
// DELETE /usuario/:id    ( borrar usuario por id)
// ==========================================================
app.delete( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    let id = req.params.id;
    

    // Usando el modelo de mongoose
    Usuario.findByIdAndRemove( id , (err, usuarioBorrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                mensaje: 'Error al borrar usuario', 
                errors: err
            });    
        }
        
        if (!usuarioBorrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                mensaje: 'El usuario con el id ' + id + ' no existe', 
                errors: { message: 'No esiste un usuario con ese ID'}
                
            });
        }

        // success code (200)
        res.status(200).json({
            ok: true , 
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;