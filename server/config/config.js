/** ENTORNO */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/** CREDENCIALES */
let userDB = 'cafe-user';
let passDB = 'caf3pass';

/** Vencimiento token */
process.env.CADUCIDDAD_TOKEN = 60 * 60 * 24 * 30;

/** SEED autenticación */
process.env.SEED = process.env.SEED || 'secret';

/** PUERTO */
process.env.PORT = process.env.PORT || 3000;

/** BBDD */
let DBdev = 'mongodb://localhost:27017/cafe';
let DBprod = process.env.MONGO_URI;

process.env.URLDB = (process.env.NODE_ENV === 'dev') ? DBdev: DBprod;
 