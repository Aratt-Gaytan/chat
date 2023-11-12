//conexion de base de datos
const conexion = require('./db.js');
module.exports =  (io) =>{

    let nickNames = []; 

    io.on('connection', socket =>{
        socket.on('enviar mensaje', (datos)=>{
            io.sockets.emit('nuevo mensaje', {
                msg:datos,
                username:socket.nickname
                
            });
        });

        socket.on('nuevo usuario', (datos, callback) => {
            let ID = null; // Declarar la variable ID fuera del bloque if
          
            conexion.query(`SELECT * FROM user WHERE registration_number = ?`, [datos], (error, results, fields) => {
              if (error) {
                console.error('Error en la consulta:', error);
                return;
              } else {
                if (results.length > 0) {
                  ID = results[0].registration_number; // Asignar el valor deseado a ID
                //   console.log('Valor deseado:', ID);
                }
              }
          
              if (nickNames.indexOf(datos) !== -1) {
                callback(false);
              } else {
                if ((ID && nickNames.indexOf(ID) !== -1)) {
                    callback(true);
                }
                if (results.length > 0) {
                  for (let i = 0; i < results.length; i++) {
                    socket.nickname = datos;
                    nickNames.push(results[i].registration_number);
                  }
                  io.sockets.emit('nombre usuario', nickNames);
                  callback(true);
                } else {
                  console.log('No se encontraron resultados en la consulta.');
                }
              }
            });
          });
    })
}