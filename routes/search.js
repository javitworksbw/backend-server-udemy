// search route
const express = require('express');
const app = express();


// Models where to search for

// Hospital model
const Hospital = require('../models/hospital');

// Medico model
const Medico = require('../models/medico');

// User model
const Usuario = require('../models/usuario');




// ==========================================================
//   Search by collection ( Specific search )
//   /search/collection/:table/:searchValue
//   table accepts ( medico , hospital , usuario )
// ==========================================================
app.get( '/collection/:table/:searchValue', (req, res, next ) => {

    // get the table in which to look for
    let table = req.params.table ;

    // Search value param  ( from request params )
    let searchV = req.params.searchValue;

    // regular expression to search for ( case insensitive )
    let regexp = new RegExp( searchV , 'i');

    let promiseToExecute;

    // depending on the table name ( 'hospital' , 'medico' , 'usuario' )
    switch (table) {
        case 'hospital':
                
                // search into hospital
                promiseToExecute = searchHospitals( searchV , regexp );
                    
            break;
    
        case 'medico':
 
                // search into medico
                promiseToExecute = searchMedicos( searchV , regexp );

            break;    

        case 'usuario':
                
                // search into usuario
                promiseToExecute = searchUsuarios( searchV , regexp );

            break;    
        default:
                
                // bad request    
                return res.status(400).json({
                    ok: false , 
                    message: 'Error in ulr - not correct - Supply /search/collection/:table/:searchValue',
                    error: { message: 'Name of table/collection not valid (use medico , hospital , usuario)' }
                });

            break;
    }

    // executing the promise
    promiseToExecute.then( (result) => {
            
        switch (table) {
            case 'hospital':
                   
                    // receiving the hospitals
                    res.status(200).json({
                        ok: true , 
                        hospital: result
                    });
                break;

            case 'medico':
                
                    // receiving the hospitals
                    res.status(200).json({
                        ok: true , 
                        medico: result
                    });

                break; 

            case 'usuario':
            
                    // receiving the hospitals
                    res.status(200).json({
                        ok: true , 
                        usuario: result
                    });
                    
                break;          
            default:
                break;
        }
        
        
    })
    .catch((err) => { 
        
        if ( err ) {
            return res.status(500).json({
                ok: false , 
                message: 'Error searching in promise for ' + table ,
                errors: err
            });    
        }
    });

});







// ==========================================================
// General Search ( Search in all collections by name and user by name and email)
// ==========================================================

// ==========================================================
// GET /search/all/:searchValue    ( search for searchValue in all collections )
// ==========================================================
app.get( '/all/:searchValue', (req, res, next ) => {

    // Search value param  ( from request params )
    let searchV = req.params.searchValue;

    // regular expression to search for ( case insensitive )
    let regexp = new RegExp( searchV , 'i');
    
    // Execute promises in parallel
    Promise.all([ 
            searchHospitals( searchV , regexp ) , 
            searchMedicos( searchV , regexp ) ,
            searchUsuarios( searchV , regexp )
        ]).then( (result) => {
            
            // receiving the hospitals
            res.status(200).json({
                ok: true , 
                hospitales:  result[0],
                medicos:     result[1],
                usuarios:    result[2]
            });
            
        })
        .catch((err) => { 
            
            if ( err ) {
                return res.status(500).json({
                    ok: false , 
                    message: 'Error searching in promise for hospitals and medicos',
                    errors: err
                });    
            }
        });
        
});



// Function to search in Hospitals ( will return a promise )
searchHospitals = ( searchValue , regExp ) => {

    // return a new promise
    return new Promise( (resolve, reject) => {

        // Searching in Hospital by name
        // Usando el modelo de mongoose
        Hospital.find({ nombre: regExp }, 'nombre img usuario')
            .populate('usuario', 'nombre email')
            .exec(
                (err, hospitales)=> {
                        
                    if ( err ) {
                        reject('Error loading hospitales', err); 
                    } else {
                        // send data of found hospitals
                        resolve(hospitales);
                    }

                });

    });


    


};


// Function to search in Medicos ( will return a promise )
searchMedicos = ( searchValue , regExp ) => {

    // return a new promise
    return new Promise( (resolve, reject) => {

        // Searching in Hospital by name
        // Usando el modelo de mongoose
        Medico.find({ nombre: regExp }, 'nombre img usuario hospital') 
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medicos)=> {
                        
            if ( err ) {
                reject('Error loading medicos', err); 
            } else {
                // send data of found medicos
                resolve(medicos);
            }

        });

    });


};



// Function to search in Usuarios ( will return a promise )
// will search by two different columns
searchUsuarios = ( searchValue , regExp ) => {

    // return a new promise
    return new Promise( (resolve, reject) => {

        // Searching in Hospital by name
        // Usando el modelo de mongoose
        Usuario.find({}, 'nombre email role')
                .or( [ { 'nombre': regExp } , { 'email': regExp} ] )
                .exec( (err, usuarios )=> { 
                    
                    if ( err ) {
                        reject('Error loading usuarios', err); 
                    } else {
                        // send data of found medicos
                        resolve(usuarios);
                    }

                });

    });


};


module.exports = app;