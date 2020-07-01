const mysql = require('mysql');

const connection = mysql.createPool({
    host: '104.248.231.127',
    port: '3306',
    user: 'root',
    password: 'tjmwjm824594',
    database: 'room_schema'
})

module.exports = connection;
