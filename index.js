var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser'); //Is it needed here?
var session = require('express-session');
var electionsDb = require('./modules/electionsDb.js');
var userDb = require('./modules/userDb.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var hbs = require('./modules/hbsHelper.js');
var sessionManager = require('./modules/sessionManager.js');

//Create route objects
var user_tests = require('./routes/user_tests')
var send = require('./routes/send')

var app = express();

hbs.registerHandlebars(app, handlebars);

app.set('port', 4350);
app.use(session({secret:'_qJ$_fuRZueuMrD8TCMgH6WL**h^PH'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function(req,res) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }

  res.status(200);
  context.pageTitle = "Home - Election Search";
  context.message = "Search for elections by Zip Code";
  res.render('elections', context);
});

app.get('/getLocalInfo', function(req, res, next) {
  if (!req.query.zipcode || req.query.zipcode.length != 5 || isNaN(req.query.zipcode)) {
    var context = {};
    if (sessionManager.sessionExists(req)) {
      context.sessionExists = true;
    }
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
    if (sessionManager.sessionExists(req)) {
      context.sessionExists = true;
    }
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getElectionDetails(req, res, next);
  }
});

app.get('/getPropositionDetails', function(req, res, next) {
  if (!req.query.propositionId || isNaN(req.query.propositionId)) {
    var context = {};
    if (sessionManager.sessionExists(req)) {
      context.sessionExists = true;
    }
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getPropositionDetails(req, res, next);
  }
});

app.get('/register', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('register', context);
});

app.post('/registerUser', function(req, res, next) {
  userDb.register(req, res, next);
});


app.get('/login', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('login', context);
});

app.get('/profile', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('profile', context);
});

app.get('/editProfile', function(req, res, next){
    var context = {};
  res.status(200);
  res.render('editProfile', context);
});

app.post('/updateUser', function(req, res, next) {
  userDb.updateUser(req, res, next);
});


app.post('/userLogin', function(req, res, next) {
  userDb.userLogin(req, res, next);
});

app.get('/logout', function(req, res, next) {
  if (req.session.name) {
    console.log("Logging out user " + req.session.name);
    sessionManager.killUserSession(req);
    req.status = 200;
    res.render('elections');
  } else {
    console.log("User attempted to logout but is not logged in");
    res.redirect('/login');
  }
});

<<<<<<< HEAD

app.get('/voterinformation', function(req,res) {
=======
app.get('/old', function(req,res) {
>>>>>>> 54e04ad91da754a4b8ccab1f0df0a23d867ee6d3
  res.status(200);
  var context = {};
  context.message = "Search for elections";
  res.render('voterRegistrationInfo', context);
});


app.get('/message', (req, res)=>{
    res.status(200);
    res.render('subscription');
});


app.use('/send', send)

app.use('/user-tests', user_tests)

<<<<<<< HEAD
app.use(function(req,res){
=======
})

app.use(function(req,res) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }
>>>>>>> 54e04ad91da754a4b8ccab1f0df0a23d867ee6d3
  res.type('text/plain');
  res.status(404);
  res.render('404', context);
});

app.use(function(err, req, res, next){
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500', context);
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
