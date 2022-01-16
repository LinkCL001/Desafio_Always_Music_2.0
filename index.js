const { Pool } = require('pg'); 
const process = require('process');
const { text } = require('stream/consumers');
const { release } = require('os');

const pool = new Pool(config);

const argumentos = process.argv.slice(2);
const argsInicial = argumentos[0];
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

const values = [nombre, rut, curso, nivel];

const query = {
    name: 'fetch-user',
    text: "",
    values: [],
}

// const generarQuery = (name, text, values) => {
//     return { name, text, values }
// }

const config = {
    user: "postgres",
    host: "localhost",
    database: "estudiantes",
    password: "2619",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connnectionTimeoutMillis: 2000,
}

const client = new Client(config);
client.connect();

async function ingresar(nombre, rut, curso, nivel) {   

    pool.connect(async(error_conexion, client, release) => {

        if (error_conexion)
        return console.error(error_conexion.code)

        const SQLQuery = {
            name: "Ingresar",
            text: "insert into estudiantes (nombre, rut, curso, nivel) values ( $1 , $2, $3, $4 ) RETURNING *;",
            values: [nombre, rut, curso, nivel],
        }
        try {
            const res = await client.query(SQLQuery); 
            console.log(`Ultimo Estudiante ${res.rows[0].nombre} agregado con éxito.`);  

        } catch(error_consulta){
            console.log("! Error consulta !", error_consulta.code)
        }

        release();
        
        pool.end();
    });
}

if (metodo === 'nuevo') {
    ingresar(nombre, rut, curso, nivel)

} else if (metodo === 'rut'){
    consultaRut(nombre)   

} else if (metodo === 'consulta'){
    consulta()

} else if (metodo === 'editar'){
    editar(nombre, rut, curso, nivel)

} else if (metodo === 'eliminar'){
    eliminar(nombre)
}

async function consultaRut(rut) { 

    pool.connect(async(error_conexion, client, release) => {

        if(error_conexion)
        return console.log(error_conexion.code);
        const SQLQuery = {
            name:"consultaRut",
            text:'SELECT * FROM estudiantes WHERE rut = $1',
            values: [rut],
        };
        try {
            const res = await client.query(SQLQuery);
            console.log('Resgistro actual: ', res.rows[0]);
        } catch (error_consulta) {
            console.log("Error de conexion: ", error_consulta.code);
        }
        release();

        pool.end();
    })
    
    console.log(rutEstudiante);
    const res = await client.query(`SELECT * FROM estudiantes WHERE rut='${rutEstudiante}'`)
    console.log("Registros: ", res.rows);
    client.end()
}

async function consulta(){ // 4. Crear una función asíncrona para obtener por consola todos los estudiantes registrados.(1 Punto)
     const res = await client.query("SELECT * FROM estudiantes")
     console.log("Registros: ", res.rows)
     client.end()
}
 
async function editar(){ // 5. Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos.(2 Puntos)
    const res = await client.query(
        `UPDATE estudiantes SET nombre='${nombre}',rut='${rut}',curso='${curso}',nivel=${nivel} WHERE rut='${rut}' RETURNING *`
    )
    console.log("Registro modificado:", res.rows[0])
    console.log("Cantidad de registros afectados", res.rowCount)
    client.end()
}
 
async function eliminar() { // 6. Crear una función asíncrona para eliminar el registrodeunestudiantedelabasede datos.(2 Puntos)
    const res = await client.query(
        `DELETE FROM estudiantes WHERE rut='${rut}' RETURNING *`
    )
    console.log("Cantidad de registros afectados: ", res.rowCount)
    client.end()
}







