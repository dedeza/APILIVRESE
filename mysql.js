const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: '',
    password: '',
    database: 'livros_db',
    port: 3306
  });

exports.pool = connection;