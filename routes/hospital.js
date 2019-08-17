const express               = require('express'); 
const mdAuth                = require('../middlewares/auth');
const cors                  = require('cors');
const corsOptions           = require('../middlewares/corsOptions');

const app = express();


// Hospital model
const Hospital = require('../models/hospital');

// ==========================================================
// GET /hospital    ( obtener todos los hospitales )
// ==========================================================
app.get( '/', cors(corsOptions), (req, res ) => {

    // Creating the pagination

    // desde
    let offset = req.query.offset || 0;
    offset = Number(offset);


    // Usando el modelo de mongoose
    Hospital.find({ }, 'nombre img usuario' )
    .skip(offset)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
            (err, hospitales)=> {
                
                if ( err ) {
                    return res.status(500).json({
                        ok: false , 
                        message: 'Error loading hospitals',
                        errors: err
                    });    
                }

                // Returns the number of registers ( count registers )
                Hospital.count({}, (err, count)=> {
                    
                    if ( err ) {
                        return res.status(500).json({
                            ok: false , 
                            message: 'Error counting hospitales in pagination',
                            errors: err
                        });    
                    }

                    res.status(200).json({
                        ok: true , 
                        hospitales: hospitales,
                        count: count
                    });

                });

            }
        );

    

});


 
// ==========================================================
// PUT /hospital/:id    ( actualizar hospital por id)
// ==========================================================
app.put( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    let id      = req.params.id;
    let body    = req.body;
    

    // Usando el modelo de mongoose
    Hospital.findById( id , (err, hospitalEncontrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                message: 'Error al buscar hospital', 
                errors: err
            });    
        }

        if (!hospitalEncontrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El hospital con el id ' + id + ' no existe', 
                errors: err
                
            });
        }

        // update field values
        hospitalEncontrado.nombre    = body.nombre         ;
        hospitalEncontrado.img       = body.img            ;


        // saves into the database
        hospitalEncontrado.save( (err, hospitalGuardado ) => {

            if ( err ) {

                // 400 - Bad request error
                return res.status(400).json({
                    ok: false , 
                    message: 'Error updating hospital',
                    errors: err
                });    
            }


            // success code (200)
            res.status(200).json({
                ok: true , 
                hospital: hospitalGuardado
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
    Hospital.find({ _id: req.params.id }, (err, hospitalEncontrado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error getting hospital',
                errors: err
            });    
        }

        // http successfull code  (200)
        res.status(200).json({
            ok: true , 
            hospital: hospitalEncontrado
        });

    });

});


// ==========================================================
// POST /hospital    ( create hospital - create hospital )
// ==========================================================
app.post( '/',  mdAuth.auth_verify_token, (req, res ) => {

    const body = req.body;

    
    // NOTE
    // if I use postman without the authentication middleware ( skiping it )
    // I must provide the usuario - like this
    // If not I get the usuario from the authentication middleware in req.usuario._id

/*
    // basado en el modelo de mongoose
    const hospital = new Hospital({
        nombre: body.nombre ,
        img: body.img,
        usuario: body.usuario_id
    });
*/

    // basado en el modelo de mongoose
    // I get the usuario from the authentication middleware in req.usuario._id
    const hospital = new Hospital({
        nombre: body.nombre ,
        img: body.img,
        usuario: req.usuario._id
    });



    
    // saves into the database
    hospital.save( (err, hospitalGuardado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error saving hospital',
                errors: err
            });    
        }

        // object created code (201)
        res.status(201).json({
            ok: true , 
            hospital: hospitalGuardado
        });

    });

});






// ==========================================================
// DELETE /hospital/:id    ( borrar hospital por id)
// ==========================================================
app.delete( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    let id = req.params.id;
    

    // Usando el modelo de mongoose
    Hospital.findByIdAndRemove( id , (err, hospitalBorrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                message: 'Error al borrar hospital', 
                errors: err
            });    
        }
        
        if (!hospitalBorrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El hospital con el id ' + id + ' no existe', 
                errors: { message: 'No esiste un hospital con ese ID'}
                
            });
        }

        // success code (200)
        res.status(200).json({
            ok: true , 
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;
