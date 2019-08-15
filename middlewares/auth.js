const jwt     = require('jsonwebtoken');
const SEED    = require('../config/config').SEED;  


// ==========================================================
// Verify Token Middleware ( uso de next )
// ==========================================================
module.exports.auth_verify_token = ( req, res, next) => {

    // leer el token
    const token = req.query.token ;

    // verify valid token
    // verify a token symmetric
    jwt.verify(token, SEED, (err, decoded) => {
        
        if ( err ) {
            // 401 UnAuthorized
            return res.status(401).json({
                ok: false ,
                mensaje: 'User not authenticated - Invalid Token', 
                errors: err
            });
        }
        //console.log(decoded.usuario);
        
        // I can put the user data for all the next calls
        // and put it in req object ( available for subsequent requests )
        req.usuario = decoded.usuario;

        next();

    });

};



