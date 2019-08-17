// main root
const express = require('express');
const app = express();


app.get( '/', (req, res, next ) => {

    res.send(
    `<html>
        <body>
            <form ref='uploadForm' 
            id='uploadForm' 
            action='http://localhost:3000/upload/medico/5d57b0658bd2a806c07361c1' 
            method='post'  
            encType="multipart/form-data">
                <input type="file" name="sampleFile" />
                <input type='submit' value='Upload!' />
            </form>     
        </body>
        
    </html>`);

});

module.exports = app;