const mysql = require('mysql')

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER    ,
    password: process.env.DB_PASS    ,
    database: process.env.DB_DATABASE,
}

const con = mysql.createConnection(config)

module.exports = con;