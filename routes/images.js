// main root
const express = require('express');
const app = express();

const path = require('path');
const fs   = require('fs');



// ==========================================================
// GET /images/:userType/:img    ( obtener una imagen )
// ==========================================================
app.get( '/:userType/:img', (req, res, next ) => {

    // user type and img
    let userType = req.params.userType;
    let img      = req.params.img ;

    // path to find the image file
    let pathImage = path.resolve( __dirname , `../uploads/${userType}/${img}` );

    // verify if image file exists
    if ( fs.existsSync( pathImage) ) {
        
        // send the file
        res.sendFile( pathImage );
    
    } else {
    
        // there is no image and send the no-img.jpg file

        let pathNoImage = path.resolve( __dirname , `../assets/no-img.jpg` );
        res.sendFile( pathNoImage );
    }


/*
    res.status(200).json({
        ok: true , 
        message: 'Success Request'
    });
*/

});

module.exports = app;