const express               = require('express');
const bcrypt                = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const SEED                  = require('../config/config').SEED;  
const mdAuth                = require('../middlewares/auth');
const cors                  = require('cors');
const corsOptions           = require('../middlewares/corsOptions');

const app = express();


// User model
const Usuario = require('../models/usuario');

// ==========================================================
// GET /usuario    ( obtener todos los usuarios )
// ==========================================================
app.get( '/', cors(corsOptions), (req, res ) => {

    // Creating the pagination
    
    // desde
    let offset = req.query.offset || 0;
    offset = Number(offset);

    // Usando el modelo de mongoose
    Usuario.find({ }, 'nombre email img role' )
    .skip(offset)
    .limit(5)
    .exec(
            (err, usuarios)=> {
                
                if ( err ) {
                    return res.status(500).json({
                        ok: false , 
                        message: 'Error loading user',
                        errors: err
                    });    
                }

                // Returns the number of registers ( count registers )
                Usuario.count({}, (err, count)=> {
                    
                    if ( err ) {
                        return res.status(500).json({
                            ok: false , 
                            message: 'Error counting users in pagination',
                            errors: err
                        });    
                    }

                    res.status(200).json({
                        ok: true , 
                        usuarios: usuarios,
                        count: count
                    });

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
                message: 'Error al buscar usuario', 
                errors: err,
                usuario: []
            });    
        }

        if (!usuarioEncontrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El usuario con el id ' + id + ' no existe', 
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

        // hides the password
        usuarioEncontrado.password = ':)';

        // http successfull code  (200)
        res.status(200).json({
            ok: true , 
            usuario: usuarioEncontrado
        });

    });

});


// ==========================================================
// POST /usuario    ( register usuarios - create users )
// ==========================================================
app.post( '/',  (req, res ) => {

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
                message: 'Error al borrar usuario', 
                errors: err
            });    
        }
        
        if (!usuarioBorrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El usuario con el id ' + id + ' no existe', 
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