// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'barqlbm57xrezrrgni5w-mysql.services.clever-cloud.com',
    user: 'unutjes8ehbvijub',
    password: 'J5sMoY4zsKEx7NWvavKH',
    database: 'barqlbm57xrezrrgni5w',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
