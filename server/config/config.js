/** ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/** CREDENCIALES */
let userDB = 'cafe-user';
let passDB = 'caf3pass';

/** PUERTO */
process.env.PORT = process.env.PORT || 3000;

/** BBDD */
let DBdev = 'mongodb://localhost:27017/cafe';
let DBprod = 'mongodb://'+userDB+':'+passDB+'@ds135974.mlab.com:35974/cafe'

process.env.URLDB = (process.env.NODE_ENV === 'dev') ? DBdev: DBprod;
 