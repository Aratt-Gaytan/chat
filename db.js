const mysql = require("mysql");

let conexion = mysql.createConnection({
  host: "barqlbm57xrezrrgni5w-mysql.services.clever-cloud.com",
  database: "barqlbm57xrezrrgni5w",
  user: "unutjes8ehbvijub",
  password: "J5sMoY4zsKEx7NWvavKH"
});

conexion.connect(function (err) {
  if(err){
    throw err;
  }else{
    console.log("Conexion exitosa");
  }
});

module.exports = conexion;