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
var partyDb = require("./modules/politicalPartyDb.js");

//Create route objects
var user_tests = require('./routes/user_tests')
var send = require('./routes/send')

var app = express();

hbs.registerHandlebars(app, handlebars);

app.set('port', process.argv[2]);
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
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }

  if (!req.query.zipcode || req.query.zipcode.length != 5 || isNaN(req.query.zipcode)) {
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getElectionInfo(req, res, next);
  }
});

app.get('/getElectionDetails', function(req, res, next) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }

  if (!req.query.electionId || isNaN(req.query.electionId)) {
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getElectionDetails(req, res, next);
  }
});

app.get('/getPropositionDetails', function(req, res, next) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }

  if (!req.query.propositionId || isNaN(req.query.propositionId)) {
    context.invalidZipCode = "Invalid zip code";
    res.status(200);
    res.render('elections', context);
  } else {
    electionsDb.getPropositionDetails(req, res, next);
  }
});

app.get('/register', function(req, res, next) {
  if (sessionManager.sessionExists(req)) {
    res.redirect('/profile');
  } else {
    partyDb.getAllParties(req, res, next, function(req, res, rows) {
      var context = {};
      context.parties = rows;
      context.sessionExists = true;
      res.status(200);
      res.render('register', context);
    });
  }
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
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
    context.user = sessionManager.get(req, "user");
    res.status(200);
    res.render('profile', context);
  } else {
    res.status(200);
    res.redirect('/login');
  }
});

app.get('/editProfile', function(req, res, next) {
  if (sessionManager.sessionExists(req)) {
    partyDb.getAllParties(req, res, next, function(req, res, rows) {
      var context = {};
      context.parties = rows;
      context.sessionExists = true;
      context.user = sessionManager.get(req, "user");
      res.status(200);
      res.render('editProfile', context);
    });
  } else {
    res.status(200);
    res.redirect('/login');
  }
});

app.post('/updateUser', function(req, res, next) {
  if (sessionManager.sessionExists(req)) {
    userDb.updateUserInfo(req, res, next, function(req, res, rows) {
      userDb.getUserProfile(req, res, next, function(req, res, rows) {
        var user = {
          "username": rows[0].username,
          "email": rows[0].email,
          "password": '',
          "zipcode": rows[0].zipcode,
          "party": rows[0].party,
          "political_party_id": rows[0].political_party_id,
          "reminder": rows[0].reminder,
          "newsletter": rows[0].newsletter
        };
        sessionManager.put(req, "user", user);
        res.redirect('/profile');
      })
    });
  } else {
    res.status(200);
    res.redirect('/login');
  }
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


app.get('/voterinformation', function(req,res) {
  res.status(200);
  var context = {};
  context.url = "https://vote.gov/register/";
  context.stateMap = [
    {"Alabama": "al"},
    {"Alaska": "ak"},
    {"American Samoa": "as"},
    {"Arizona": "az"},
    {"Arkansas": "ar"},
    {"California": "ca"},
    {"Colorado": "co"},
    {"Connecticut": "ct"},
    {"Delaware": "de"},
    {"District of Columbia": "dc"},
    {"Florida": "fl"},
    {"Georgia": "ga"},
    {"Guam" : "gu"},
    {"Hawaii": "hi"},
    {"Idaho": "id"},
    {"Illinois": "il"},
    {"Indiana": "in"},
    {"Iowa": "ia"},
    {"Kansas": "ks"},
    {"Kentucky": "ky"},
    {"Louisiana": "la"},
    {"Maine": "me"},
    {"Maryland": "md"},
    {"Massachusetts": "ma"},
    {"Michigan": "mi"},
    {"Minnesota": "mn"},
    {"Mississippi": "ms"},
    {"Missouri": "mo"},
    {"Montana": "mt"},
    {"Nebraska": "ne"},
    {"Nevada": "nv"},
    {"New Hampshire": "nh"},
    {"New Jersey": "nj"},
    {"New Mexico": "nm"},
    {"New York": "ny"},
    {"North Carolina": "nc"},
    {"North Dakota": "nd"},
    {"Northern Mariana Islands": "mp"},
    {"Ohio": "oh"},
    {"Oklahoma": "ok"},
    {"Oregon": "or"},
    {"Pennsylvania": "pa"},
    {"Puerto Rico": "pr"},
    {"Rhode Island": "ri"},
    {"South Carolina": "sc"},
    {"South Dakota": "sd"},
    {"Tennessee": "tn"},
    {"Texas": "tx"},
    {"Utah": "ut"},
    {"Vermont": "vt"},
    {"Virgin Islands": "vi"},
    {"Virginia": "va"},
    {"Washington": "wa"},
    {"West Virginia": "wv"},
    {"Wisconsin": "wi"},
    {"Wyoming": "wy"}
  ]
  res.render('voterRegistrationInfo', context);
});


app.get('/message', (req, res)=>{
    res.status(200);
    res.render('subscription');
});


app.use('/send', send)

app.use('/user-tests', user_tests)

app.use(function(req,res) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }
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
