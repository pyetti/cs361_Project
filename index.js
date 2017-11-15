var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

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
