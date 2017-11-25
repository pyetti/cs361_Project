var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var electionsDb = require('./modules/electionsDb.js');
var userDb = require('./modules/userDb.js');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var hbs = require('./modules/hbsHelper.js');
var sessionManager = require('./modules/sessionManager.js');

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

app.get('/login', function(req, res, next) {
  var context = {};
  res.status(200);
  res.render('login', context);
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



app.post('/send', urlencodedParser, function(req, res) {


  console.log(req.body.email);

  const output = `<p> This is a email subscription <%= req.body.email %> test</p>`;

// create reusable transporter object using the default SMTP transport
// Following three blocks of code are sourced from https://nodemailer.com/about/
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'voter.info.cs361@gmail.com',
            pass: 'osucs361'

        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'VOTE✔LOCAL <voter.info.cs361@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'VOTE✔LOCAL test message cs361', // Subject line
        text: req.body.message, // plain text body
        html:  output// html body

    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });




        res.render('subscription', {updateForm:'Message sent'});

})

app.use(function(req,res) {
  var context = {};
  if (sessionManager.sessionExists(req)) {
    context.sessionExists = true;
  }
  res.type('text/plain');
  res.status(404);
  res.render('400', context);
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
