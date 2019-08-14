// Requires
const express = require('express');
const mongoose = require('mongoose');


// initializes variables
const app = express();


// Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => {
    throw err;
});

db.once('open', function() {
  // we're connected!

  console.log('Base de datos hospitalDB: \x1b[36m%s\x1b[0m', 'online');

});


// Routes
app.get( '/', (req, res, next ) => {

    res.status(200).json({
        ok: true , 
        message: 'Success Request'
    });

});


// Listen for request
app.listen( 3000, () => {
    console.log('Express Server running on port 3000: \x1b[36m%s\x1b[0m', 'online');
});