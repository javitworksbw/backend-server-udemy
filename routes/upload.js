
const express      = require('express');
const fileUpload   = require('express-fileupload');
const fs           = require('fs');

const app = express();


// Models where to search for

// Hospital model
const Hospital = require('../models/hospital');

// Medico model
const Medico = require('../models/medico');

// User model
const Usuario = require('../models/usuario');




// default options  ( middleware to upload files )
app.use(fileUpload());

// file goes in req.files




// get the user type ( 'hospital' , 'medico' , 'usuario' ) to know whete to put the image
// :userId is needed for the uploaded file name on the server
app.post( '/:userType/:userId', (req, res, next ) => {

    // user type and user id
    let userType = req.params.userType;
    let userId   = req.params.userId ;

    // valid collections
    let validCollections = [ 'hospital', 'medico', 'usuario' ];
    // check for valid collections
    if ( validCollections.indexOf( userType ) < 0 ) {

        return res.status(400).json({
            ok: false , 
            message: "No valid userType - (use 'hospital', 'medico', 'usuario', 'jpeg')",
            errors: { message: 'Not a valid userType for image upload' }
        });
    }


    // if uploaded files come
    if (!req.files) {
        
        return res.status(400).json({
            ok: false , 
            message: 'No files were uploaded',
            errors: { message: 'Please Select File to Upload' }
        });
    }
 
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let uploadFile = req.files.sampleFile;

    // splits the name to get the file extension 
    let splitName = uploadFile.name.split('.')
    let fileExtension = splitName[ splitName.length-1];

    // validate valid file extensions
    let validExtensions = [ 'png', 'jpg', 'gif', 'jpeg' ];
    
    // check for valid extension
    if ( validExtensions.indexOf( fileExtension ) < 0 ) {

        return res.status(400).json({
            ok: false , 
            message: "No valid file extension - (use 'png', 'jpg', 'gif', 'jpeg')",
            errors: { message: 'Not a valid file extension for image' }
        });
    }

    // generate custom file name 
    let fileName = `${userId}-${ new Date().getMilliseconds() }.${fileExtension}`;

    // console.log( fileName );

    let fileNameAndPath = `./uploads/${userType}/${fileName}`;

    // move the temp file to a server path
    // Use the mv() method to place the file somewhere on your server
    uploadFile.mv( fileNameAndPath , (err) => {
    
        if ( err ) {
            // Server Error
            res.status(500).json({
                ok: true , 
                message: 'Error on moving file',
                errors: err
                
            }); 
        }

        // this fuction assigns the file to the user
        uploadByType( userType, userId, fileName, res );
        /*
        res.status(200).json({
            ok: true , 
            message: 'File Uploaded',
            name: uploadFile.name ,
            fileExtension: fileExtension
            
        });
        */

    });


    

})


// function to assign a picture to an hospital, medico or usuario
let uploadByType = (userType , userId, fileName, res ) => {

    // userType hospital
    if ( userType === 'hospital') {

            // Usando el modelo de mongoose
            Hospital.findById({ _id: userId }, (err, hospital ) => {

                if ( err ) {

                    // 400 - Bad request error
                    return res.status(400).json({
                        ok: false , 
                        message: 'Error getting hospital uploadByType',
                        errors: err
                    });    
                }

                // old image path
                const oldImagePath = './uploads/hospital/' + hospital.img ;

                // if exists the file ( remove it)
                if ( fs.existsSync( oldImagePath ) ) {
                    
                    // removes the file from the server
                    fs.unlinkSync( oldImagePath );
                }

                // Assigns the image fileName to usuario
                hospital.img = fileName ;

                // saves the changes
                hospital.save( (err, hospitalActualizado) => {

                    if ( err ) {

                        // Server Error
                        res.status(500).json({
                            ok: true , 
                            message: 'Error updating image name in hospital',
                            errors: err
                            
                        });

                    }
                    

                    // http successfull code  (200)
                    return res.status(200).json({
                        ok: true , 
                        message: 'Hospital Image updated',
                        hospital: hospitalActualizado
                        
                    });

                });

            });

    }

    // userType medico
    if ( userType === 'medico') {

            // Usando el modelo de mongoose
            Medico.findById({ _id: userId }, (err, medico ) => {

                if ( err ) {

                    // 400 - Bad request error
                    return res.status(400).json({
                        ok: false , 
                        message: 'Error getting medico uploadByType',
                        errors: err
                    });    
                }

                // old image path
                const oldImagePath = './uploads/medico/' + medico.img ;

                // if exists the file ( remove it)
                if ( fs.existsSync( oldImagePath ) ) {
                    
                    // removes the file from the server
                    fs.unlinkSync( oldImagePath );
                }

                // Assigns the image fileName to usuario
                medico.img = fileName ;

                // saves the changes
                medico.save( (err, medicoActualizado) => {

                    if ( err ) {

                        // Server Error
                        res.status(500).json({
                            ok: true , 
                            message: 'Error updating image name in medico',
                            errors: err
                            
                        });

                    }
                    

                    // http successfull code  (200)
                    return res.status(200).json({
                        ok: true , 
                        message: 'Medico Image updated',
                        medico: medicoActualizado
                        
                    });

                });

            });

    }

    // userType usuario
    if ( userType === 'usuario') {

            // Usando el modelo de mongoose
            Usuario.findById({ _id: userId }, (err, usuario ) => {

                if ( err ) {

                    // 400 - Bad request error
                    return res.status(400).json({
                        ok: false , 
                        message: 'Error getting user uploadByType',
                        errors: err
                    });    
                }

                // old image path
                const oldImagePath = './uploads/usuario/' + usuario.img ;

                // if exists the file ( remove it)
                if ( fs.existsSync( oldImagePath ) ) {
                    
                    // removes the file from the server
                    fs.unlinkSync( oldImagePath );
                }

                // Assigns the image fileName to usuario
                usuario.img = fileName ;

                // saves the changes
                usuario.save( (err, usuarioActualizado) => {

                    if ( err ) {

                        // Server Error
                        res.status(500).json({
                            ok: true , 
                            message: 'Error updating image name in user',
                            errors: err
                            
                        });

                    }
                    

                    // http successfull code  (200)
                    return res.status(200).json({
                        ok: true , 
                        message: 'Usuario Image updated',
                        usuario: usuarioActualizado
                        
                    });

                });

            });

    }    

    

}


module.exports = app;



