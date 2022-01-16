const { Pool } = require("pg");
const process = require("process");

const argumentos = process.argv.slice(2);
const argsInicial = argumentos[0];
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

const config = { //Realizar la conexión con PostgreSQL, utilizando la clase Pool y definiendo un máximo de 20 clientes, 5 segundos como tiempo máximo de inactividad de uncliente y 2 segundos de espera de un nuevo cliente.(2 Puntos)
  user: "postgres",
  host: "localhost",
  database: "estudiantes",
  password: "2619",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connnectionTimeoutMillis: 2000,
};

const pool = new Pool(config);

async function ingresar(nombre, rut, curso, nivel) {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion) return console.error(error_conexion.code);//Retornar por consola un mensaje de error en caso de haberproblemasdeconexión

    const SQLQuery = {//Hacer todas las consultas con un JSON como argumento definiendo la propiedad name para el Prepared Statement.(2 Puntos)
      name: "ingresar",
      text: "insert into estudiantes (nombre, rut, curso, nivel) values ( $1 , $2, $3, $4 ) RETURNING *;",
      values: [nombre, rut, curso, nivel],
    };
    try {
      const res = await client.query(SQLQuery);
      console.log(
        `Ultimo Estudiante ${res.rows[0].nombre} agregado con éxito.`
      );
    } catch (error_consulta) {
      console.log("! Error consulta !", error_consulta.code);//Capturar los posibles errores en todas las consultas
    }

    release();//Liberar a un cliente al concluir su consulta

    pool.end();
  });
}

async function consultaRut(rut) {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion) return console.log(error_conexion.code);//Retornar por consola un mensaje de error en caso de haberproblemasdeconexión

    const SQLQuery = { //Hacer todas las consultas con un JSON como argumento definiendo la propiedad name para el Prepared Statement.(2 Puntos)
      name: "consultaRut",
      text: "SELECT * FROM estudiantes WHERE rut = $1", //Hacer las consultas con texto parametrizado.
      values: [rut],
    };
    try {
      const res = await client.query(SQLQuery);
      console.log("Resgistro actual: ", res.rows[0]);//Obtener el registro de los estudiantes registrados en formato de arreglos
    } catch (error_consulta) {
      console.log("Error de conexion: ", error_consulta.code);//Capturar los posibles errores en todas las consultas
    }
    release();//Liberar a un cliente al concluir su consulta

    pool.end();
  });
}

async function consulta() {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion) return console.log(error_conexion.code);//Retornar por consola un mensaje de error en caso de haberproblemasdeconexión

    const SQLQuery = {
      rowMode: "array",
      text: "SELECT * FROM estudiantes",//Hacer las consultas con texto parametrizado.
    };
    try {
      const res = await client.query(SQLQuery);
      console.log("Registro actual:", res.rows);//Obtener el registro de los estudiantes registrados en formato de arreglos
    } catch (error_consulta) {
      console.log("Error de conexion: ", error_consulta.code);//Capturar los posibles errores en todas las consultas
    }
    release();//Liberar a un cliente al concluir su consulta

    pool.end();
  });
}

async function editar(nombre, rut, curso, nivel) {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion) return console.log(error_conexion.code);//Retornar por consola un mensaje de error en caso de haberproblemasdeconexión

    const SQLQuery = {// Hacer todas las consultas con un JSON como argumento definiendo la propiedad name para el Prepared Statement.(2 Puntos)
      name: "editar",
      text: "UPDATE estudiantes SET nombre = $1, nivel = $3, curso = $4 WHERE rut = $2 RETURNING *",//Hacer las consultas con texto parametrizado.
      values: [nombre, rut, curso, nivel],
    };
    try {
      const res = await client.query(SQLQuery);
      console.log(`Estudiante ${res.rows[0].nombre} editado con éxito`);//Obtener el registro de los estudiantes registrados en formato de arreglos
    } catch (error_consulta) {
      console.log("Error de conexion: ", error_consulta.code);//Capturar los posibles errores en todas las consultas
    }
    release();//Liberar a un cliente al concluir su consulta

    pool.end();
  });
}

async function eliminar(rut) {
  pool.connect(async (error_conexion, client, release) => {
    if (error_conexion)
      return console.log("Error de conexion: ", error_conexion.code);// Retornar por consola un mensaje de error en caso de haberproblemas de conexión

    const SQLQuery = {// Hacer todas las consultas con un JSON como argumento definiendo la propiedad name para el Prepared Statement.(2 Puntos)
      name: "eliminar",
      text: "DELETE FROM estudiantes WHERE rut = $1 RETURNING *",//Hacer las consultas con texto parametrizado.
      values: [rut],
    };
    try {
      const res = await client.query(SQLQuery);
      console.log(
        `Registro de estudiante con rut ${res.rows[0].rut} eliminado con éxito`);//Obtener el registro de los estudiantes registrados en formato de arreglos
    } catch (error_consulta) {
      console.log("Error de consulta: ", error_consulta.code);//Capturar los posibles errores en todas las consultas
    }
    release();//Liberar a un cliente al concluir su consulta

    pool.end();
  });
}

if (argsInicial === "ingresar") {
  ingresar(nombre, rut, curso, nivel);
} else if (argsInicial === "consultaRut") {
  consultaRut(nombre);
} else if (argsInicial === "consulta") {
  consulta();
} else if (argsInicial === "editar") {
  editar(nombre, rut, curso, nivel);
} else if (argsInicial === "eliminar") {
  eliminar(nombre);
}
