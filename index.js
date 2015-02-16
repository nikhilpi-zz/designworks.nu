var express = require('express');
var app = express();
var config = require('./config')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.pass
    }
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/process', function(request, response) {
  response.render('process.html');
});

app.get('/portfolio', function(request, response) {
  response.render('portfolio.html');
});

app.get('/services', function(request, response) {
  response.render('services.html');
});

app.get('/team', function(request, response) {
  response.render('team.html');
});

app.post('/mail', function(request, response) {

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
    });
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
