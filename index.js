var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser'); //Is it needed here?
var session = require('express-session');
var electionsDb = require('./modules/electionsDb.js');
var userDb = require('./modules/userDb.js'); // Add the user database file
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var hbs = require('./modules/hbsHelper.js');
//Route objects
var user_tests = require('./routes/user_tests')
var send = require('./routes/send')
var app = express();

hbs.registerHandlebars(app, handlebars);

app.set('port', 4350);
app.use(session({secret:'_qJ$_fuRZueuMrD8TCMgH6WL**h^PH'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/user-tests', user_tests)

app.get('/', function(req,res) {
  res.status(200);
  var context = {};
  context.pageTitle = "Home - Election Search";
  context.message = "Search for elections by Zip Code";
  res.render('elections', context);
});

app.get('/getLocalInfo', function(req, res, next) {
  if (!req.query.zipcode || req.query.zipcode.length != 5 || isNaN(req.query.zipcode)) {
    var context = {};
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getElectionInfo(req, res, next);
  }
});

app.get('/getElectionDetails', function(req, res, next) {
  if (!req.query.electionId || isNaN(req.query.electionId)) {
    var context = {};
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getElectionDetails(req, res, next);
  }
});

app.get('/register', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('register', context);
});

app.get('/login', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('login', context);
});




app.get('/getPropositionDetails', function(req, res, next) {
  if (!req.query.propositionId || isNaN(req.query.propositionId)) {
    var context = {};
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getPropositionDetails(req, res, next);
  }
});


app.get('/old', function(req,res) {
  res.status(200);
  var context = {};
  context.message = "Search for elections";
  res.render('subscription', context);
});





app.post('/registeruser', function(req, res, next) {
 // user.registerUser(req, res, next);
  console.log(req.body);

  userDb.register(req,res,next);        // FIXME


});

app.get('/message', (req, res)=>{
    res.status(200);
    res.render('subscription');
});

app.use('/send', send)


app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
