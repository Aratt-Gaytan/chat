const db = require('./db');

const createChat = async (nick, msg) => {
  let connection;
  try {
    connection = await db.getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO mensajes (Nombre, mensaje, fecha) VALUES (?, ?, ?); delete from mensajes;',
      [nick, msg, new Date()]
    );

    return result.insertId;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release(); // Liberar la conexión cuando hayas terminado
    }
  }
};

module.exports = { createChat };
