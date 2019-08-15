// main root
const express = require('express');
const app = express();


app.get( '/', (req, res, next ) => {

    res.status(200).json({
        ok: true , 
        message: 'Success Request'
    });

});

module.exports = app;