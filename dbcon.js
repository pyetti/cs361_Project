var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_realeb',
  password        : '0138',
  database        : 'cs361_realeb'
});

module.exports.pool = pool;
