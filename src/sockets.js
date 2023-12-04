const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db =  mysql.createPool({
    host: 'barqlbm57xrezrrgni5w-mysql.services.clever-cloud.com',
    user: 'unutjes8ehbvijub',
    password: 'J5sMoY4zsKEx7NWvavKH',
    database: 'barqlbm57xrezrrgni5w',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const loadMessages = async (socket) => {
    try {
        // Cargar mensajes desde la base de datos
        const query = 'SELECT * FROM mensajes';
        const results = await db.promise().query(query);

        // Emitir los mensajes al socket que se conecta
        socket.emit('load old msgs', results[0]);

        // Emitir los mensajes al resto de los sockets
        socket.broadcast.emit('load old msgs', results[0]);

        return results[0];
    } catch (error) {
        console.error('Error al cargar mensajes desde la base de datos:', error);
        return [];
    }
};

module.exports = function (io){

    let users = {};

    io.on('connection', async (socket) => {
        console.log('nuevo usuario conectado');

        await loadMessages(socket);

        socket.on('new user', (data,cb) =>{
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        socket.on('send message', async (data, cb) => {
            var msg = data.trim();
            if(msg.substr(0,3) === '/W '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substring(0,index);
                    var msg = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error: Por favor inserte un usuario valido')
                    }
                }else{
                    cb('Error: Por favor proporcione su mensaje');
                }
            }else{
                const query = 'INSERT INTO mensajes (Nombre, mensaje, fecha) VALUES (?, ?, NOW())';
                try {
                    await db.promise().execute(query, [socket.nickname, msg]);
                    io.sockets.emit('new message', {
                        msg: data,
                        nick: socket.nickname,
                    });
                } catch (error) {
                    console.error('Error al guardar mensaje en la base de datos:', error);
                    cb('Error al enviar el mensaje');
                }
            }
            
        });

        socket.on('disconnect', data =>{
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }

    });
}