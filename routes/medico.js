const express               = require('express'); 
const mdAuth                = require('../middlewares/auth');
const cors                  = require('cors');
const corsOptions           = require('../middlewares/corsOptions');

const app = express();


// Medico model
const Medico = require('../models/medico');

// ==========================================================
// GET /medico    ( obtener todos los medicos )
// ==========================================================
app.get( '/', cors(corsOptions), (req, res ) => {


    // Creating the pagination

    // desde
    let offset = req.query.offset || 0;
    offset = Number(offset);

       
    // Usando el modelo de mongoose
    Medico.find({ }, 'nombre img usuario hospital' )
    .skip(offset)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(
            (err, medicos)=> {
                
                if ( err ) {
                    return res.status(500).json({
                        ok: false , 
                        message: 'Error loading medicos',
                        errors: err
                    });    
                }

                // Returns the number of registers ( count registers )
                Medico.count({}, (err, count)=> {
                    
                    if ( err ) {
                        return res.status(500).json({
                            ok: false , 
                            message: 'Error counting medicos in pagination',
                            errors: err
                        });    
                    }

                    res.status(200).json({
                        ok: true , 
                        medicos: medicos,
                        count: count
                    });

                });
                

            }
        );

    
});



// ==========================================================
// PUT /medico/:id    ( actualizar medico por id)
// ==========================================================
app.put( '/:id', mdAuth.auth_verify_token,  (req, res ) => {

    let id      = req.params.id;
    let body    = req.body;
    

    // Usando el modelo de mongoose
    Medico.findById( id , (err, medicoEncontrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                message: 'Error al buscar medico', 
                errors: err
            });    
        }

        if (!medicoEncontrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El medico con el id ' + id + ' no existe', 
                errors: err
                
            });
        }

        // update field values
        medicoEncontrado.nombre    = body.nombre         ;
        medicoEncontrado.img       = body.img            ;
        medicoEncontrado.hospital  = body.hospital_id    ;

        // saves into the database
        medicoEncontrado.save( (err, medicoGuardado ) => {

            if ( err ) {

                // 400 - Bad request error
                return res.status(400).json({
                    ok: false , 
                    message: 'Error updating medico',
                    errors: err
                });    
            }


            // success code (200)
            res.status(200).json({
                ok: true , 
                medico: medicoGuardado
            });

        });


    });

});



// 
// ==========================================================
// GET /medico/:id    ( obtener medico por id)
// ==========================================================
app.get( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    const body = req.body;

    // Usando el modelo de mongoose
    Medico.find({ _id: req.params.id }, (err, medicoEncontrado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error getting medico',
                errors: err
            });    
        }

        // http successfull code  (200)
        res.status(200).json({
            ok: true , 
            medico: medicoEncontrado
        });

    });

});


 
// ==========================================================
// POST /medico    ( create medico - create medico )
// ==========================================================
app.post( '/', mdAuth.auth_verify_token,  (req, res ) => {

    const body = req.body;


       // NOTE
    // if I use postman without the authentication middleware ( skiping it )
    // I must provide the usuario - like this
    // If not I get the usuario from the authentication middleware in req.usuario._id

/*
    // basado en el modelo de mongoose
    const medico = new Medico({
        nombre: body.nombre ,
        img: body.img,
        usuario: body.usuario_id,
        hospital: body.hospital_id
    });
*/

    // I get the usuario from the authentication middleware in req.usuario._id
    // basado en el modelo de mongoose
    const medico = new Medico({
        nombre: body.nombre ,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital_id
    });
    
    // saves into the database
    medico.save( (err, medicoGuardado ) => {

        if ( err ) {

            // 400 - Bad request error
            return res.status(400).json({
                ok: false , 
                message: 'Error saving medico',
                errors: err
            });    
        }

        // object created code (201)
        res.status(201).json({
            ok: true , 
            medico: medicoGuardado
        });

    });

});




// ==========================================================
// DELETE /medico/:id    ( borrar medico por id)
// ==========================================================
app.delete( '/:id', mdAuth.auth_verify_token, (req, res ) => {

    let id = req.params.id;
    

    // Usando el modelo de mongoose
    Medico.findByIdAndRemove( id , (err, medicoBorrado ) => {

        
        if ( err ) {

            // 500 Internal Server error
            return res.status(500).json({
                ok: false ,
                message: 'Error al borrar medico', 
                errors: err
            });    
        }
        
        if (!medicoBorrado ) {
            // The id does not exists ( 400 Bad Request )
            return res.status(400).json({
                ok: false ,
                message: 'El medico con el id ' + id + ' no existe', 
                errors: { message: 'No esiste un medico con ese ID'}
                
            });
        }

        // success code (200)
        res.status(200).json({
            ok: true , 
            medico: medicoBorrado
        });

    });

});


module.exports = app;
