var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');
var mysql = require('../dbcon.js');




// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the page routes


router.post('/', urlencodedParser, function(req, res) {

    //mail variable is set to sql query in radio button is set to send to users else it
    //is the value entered for email on form
    var mailList = req.body.email;
    
    console.log(req.body.emailOption);
    
    if( req.body.emailOption  === 'sendAll'){
         console.log("sendAll");
  var context = {};
  mysql.pool.query('SELECT email FROM useraccount WHERE newsletter=1', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    console.log('Collect email addresses');
    
  });




    }else{

        console.log("sendone");

    }


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


















module.exports = router