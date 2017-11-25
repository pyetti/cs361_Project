var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');





// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
/*
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})
*/

router.post('/', urlencodedParser, function(req, res) {


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