/** ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/** PUERTO */
process.env.PORT = process.env.PORT || 3000;

/** BBDD */
let DBdev = 'mongodb://localhost:27017/cafe';
let DBprod = 'mongodb://'+process.env.userDB+':'+process.env.passDB+ process.env.MONGO_URI;

process.env.URLDB = (process.env.NODE_ENV === 'dev') ? DBdev: DBprod;
 