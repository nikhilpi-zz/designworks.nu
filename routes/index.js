var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'designworks.nu@gmail.com',
    pass: 'designworks2014'
  }
});

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/portfolio', function(req, res) {
  res.render('portfolio');
});

router.get('/process', function(req, res) {
  res.render('process');
});

router.get('/services', function(req, res) {
  res.render('services');
});

router.get('/team', function(req, res) {
  res.render('team');
});

router.post('/mail', function(request, response) {

  transporter.sendMail({
    from: 'designworks.nu@gmail.com',
    to: 'designworks.nu@gmail.com',
    subject: 'Service request ' + request.body.Service,
    text: 'Service request from ' +  request.body.Email + '\n' + request.body.Message
  }, function(){
    transporter.sendMail({
      from: 'designworks.nu@gmail.com',
      to: request.body.Email,
      subject: 'Thank you for your ' + request.body.Service + ' request',
      text: 'Thank you for your service request from ' +  request.body.Email + '\n\nRequest info: ' + request.body.Message + '\n\nWe will get back to you as soon as possible!\n\nRegards,\nThe Designworks Team'
    }, function(res){
      response.redirect('/process');
    });
  });
});

module.exports = router;
