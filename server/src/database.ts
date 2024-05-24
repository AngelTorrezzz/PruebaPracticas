import mysql from 'promise-mysql';
import keys from './keys';

const pool = mysql.createPool(keys.database);//Se crea la conexion a la base de datos
pool.getConnection().then(connection => {
    pool.releaseConnection(connection)
    console.log("Base De Datos Conectada");
})

export default pool;