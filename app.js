// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// initializes variables
const app = express();



// Middlewares

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// import routes
const appRoutes     = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes   = require('./routes/login');



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
app.use('/usuario'      , usuarioRoutes         );
app.use('/login'        , loginRoutes           );
app.use('/'             , appRoutes             );



// Listen for request
app.listen( 3000, () => {
    console.log('Express Server running on port 3000: \x1b[36m%s\x1b[0m', 'online');
});