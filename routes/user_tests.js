var express = require('express')
var router = express.Router()
var mysql = require('../dbcon.js');
//var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//router.engine('handlebars', handlebars.engine);
//router.set('view engine', 'handlebars');
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM useraccount', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    console.log('Lets stop here');
    res.render('usr',context);
  });
 
 
 
 // res.send('user_tests')
})
// define the about route
router.get('/status', function (req, res) {
  res.send('query user database')
})

module.exports = router