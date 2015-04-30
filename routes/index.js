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

router.get('/apply', function(req, res) {
  res.render('apply');
});

router.post('/mail', function(request, response) {

  transporter.sendMail({
    from: 'designworks.nu@gmail.com',
    to: 'designworks.nu@gmail.com',
    subject: 'Service request ' + request.body.Service + " from " + request.body.Name,
    text: 'Service request from ' +  request.body.Name + '\n' + request.body.Email + '\n' + request.body.Message
  }, function(){
    transporter.sendMail({
      from: 'designworks.nu@gmail.com',
      to: request.body.Email,
      subject: 'Thank you for your ' + request.body.Service + ' request',
      text: 'Hello ' +  request.body.Name + '!\n\nWe have received your design request, and a member from the DesignWorks team will contact you within 24 Hours regarding the details of your request. If this request is urgent, please contact us at (847)-868-0418, or email us at\nhello@designworks.nu\n\nHave a nice day!\nThe DesignWorks Team'
    }, function(res){
      response.redirect('/process');
    });
  });
});

module.exports = router;
