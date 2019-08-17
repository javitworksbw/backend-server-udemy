const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const SEED    = require('../config/config').SEED;  

const app = express();


// User model
const Usuario = require('../models/usuario');



// ==========================================================
// POST /login    ( login de usuario - email and password )
// ==========================================================
app.post( '/', (req, res ) => {

    const body = req.body;

    Usuario.findOne( { email: body.email }, (err, usuarioEncontrado ) => {

        if ( err ) {

            // 500 - Internal Server Error 
            return res.status(500).json({
                ok: false , 
                message: 'Error logging user',
                errors: err
            });    
        }

        // verify email ( valid email )
        if (!usuarioEncontrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'Invalid login values -- email', 
                errors: err
                
            });
        }

        // verify valid password
        // Load hash from your password DB.
        const validPassword = bcrypt.compareSync( body.password , usuarioEncontrado.password ); // true    
        if ( !validPassword ) {

            // The password is not valid ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'Invalid login values -- password', 
                errors: err
                
            });
        }

        // avoid sending the password
        usuarioEncontrado.password = ':)';

        // Create token 
        const token = jwt.sign({ usuario: usuarioEncontrado  }, 
                                SEED,
                                { expiresIn: '4h' });


        // http successfull code  (200)
        res.status(200).json({
            ok: true , 
            usuario: usuarioEncontrado,
            token: token,
            id: usuarioEncontrado._id
        });

    });

    // encrypt user password
    //var salt = bcrypt.genSaltSync(10);
    //var hash = bcrypt.hashSync(body.password, salt);
    // Store hash in your password DB.

    
    
    

});




module.exports = app;