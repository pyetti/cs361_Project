var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
//var userDb = require('./modules/userDb.js'); // Add the user database file

var app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4350);
app.use(session({secret:'_qJ$_fuRZueuMrD8TCMgH6WL**h^PH'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req,res) {
  res.status(200);
  var context = {};
  context.message = "Search for elections";
  res.render('elections', context);
});

app.get('/getElectionInfo', function(req, res, next) {
  var context = {};
  if (!req.query.zipcode || req.query.zipcode.length != 5 || isNaN(req.query.zipcode)) {
    context.invalidZipCode = "Invalid zip code";
  } else {
    context.zipcode = req.query.zipcode;
    context.electionInfo = "Independent";
  }
  res.status(200);
  res.send(context);
});


app.get('/subscribe', function(req,res) {
  res.status(200);
  var context = {};
  context.message = "Search for elections";
  res.render('subscription', context);
});





app.post('/registerUser', function(req, res, next) {
  user.registerUser(req, res, next);
});

app.get('/msguser', (req, res)=>{
  //  res.status(200);
    res.render('subscription');
});

app.post('/send',(req, res) => {
  console.log(req.body);
  const output = `<p> This is a email subscription test</p>`;

// create reusable transporter object using the default SMTP transport
// Following three blocks of code are sourced from https://nodemailer.com/about/
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'voter.info.cs361@gmail.com', // generated ethereal user
            pass: 'osucs361'  // generated ethereal password

        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'VOTE"✔" <voter.info.cs361@gmail.com>', // sender address
        to: 'kierind@gmail.com, kierind@yahoo.com', // list of receivers
        subject: 'Hello Vote ✔ test message cs361', // Subject line
        text: 'Vote message test', // plain text body
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





})
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
