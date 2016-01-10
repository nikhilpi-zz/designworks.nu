var express = require('express');
var hummus = require('hummus');
var fs = require("fs");
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var async = require('async');
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'designworks.nu@gmail.com',
    pass: 'promotionalstudentdesign'
  }
});

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/portfolio', function(req, res) {
  console.log('Current directory: ' + process.cwd());
  var files = fs.readdirSync('public/img/portfolio');
  var data = {images: []};
  _.each(files, function(file){
    if(file != '.DS_Store'){
      data.images.push({filename: file});
    }
  });
  res.render('portfolio', data);
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

router.post('/mail', function(req, res) {
  var cap = req.body['g-recaptcha-response'];

  request.post({
    url:'https://www.google.com/recaptcha/api/siteverify', 
    form: { secret: '6LfpEQcTAAAAAHOer9Gk0lnDvW3MpFftJ6FGnPg5', response: cap }}, 
    function(err,httpResponse,body){ 
      var data = JSON.parse(body)
      if(data['success']){
        async.parallel([
            function(callback){
                transporter.sendMail({
                  from: 'designworks.nu@gmail.com',
                  to: 'designworks.nu@gmail.com',
                  subject: 'Service request ' + req.body.Service + " from " + req.body.Name,
                  text: 'Service request from ' +  req.body.Name + '\n' + req.body.Email + '\n' + req.body.Message
                }, callback);
            },
            function(callback){
              transporter.sendMail({
                from: 'designworks.nu@gmail.com',
                to: req.body.Email,
                subject: 'Thank you for your ' + req.body.Service + ' request',
                text: 'Hello ' +  req.body.Name + '!\n\nWe have received your design request, and a member from the DesignWorks team will contact you within 24 Hours regarding the details of your req. If this request is urgent, please contact us at (847)-868-0418, or email us at\nhello@designworks.nu\n\nHave a nice day!\nThe DesignWorks Team'
              }, callback);
            }
        ],
        // optional callback 
        function(err, results){
            console.log(err);
            console.log(results);
            res.redirect('/process');
        });
      }
  });
});

router.get('/invoiceForm',function(req, res) {
  res.render('invoice');
});

router.post('/invoice', function(req, res) {
  console.log(req);
  var params = req.body;
  // var params = {
  //   to: {
  //     org: 'NSH',
  //     address: '604 Davis St, Unit 4',
  //     email: 'nikhil@gmail.com',
  //     clientNum: '111',
  //     date: '11/11/2016'
  //   },
  //   items: [
  //     {
  //       service: 'Flyer',
  //       pricePer: '$500',
  //       amount: '3',
  //       total: '$1500'
  //     },
  //     {
  //       service: 'Flyer',
  //       pricePer: '$500',
  //       amount: '3',
  //       total: '$1500'
  //     },
  //     {
  //       service: 'Flyer',
  //       pricePer: '$500',
  //       amount: '3',
  //       total: '$1500'
  //     },
  //     {
  //       service: 'Flyer',
  //       pricePer: '$500',
  //       amount: '3',
  //       total: '$1500'
  //     }
  //   ],
  //   total: '$5000'
  // };
  
  var pdfWriter = hummus.createWriterToModify('./pdf/invoice_template.pdf',{modifiedFilePath:'./pdf/new_invoice_template.pdf'});
  var pageModifier = new hummus.PDFPageModifier(pdfWriter,0);

  //TO
  pageModifier.startContext().getContext().writeText(params.to.org,
                          80,
                          560,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:14,colorspace:'gray',color:0xFF});
  pageModifier.startContext().getContext().writeText(params.to.address,
                          80,
                          543,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:14,colorspace:'gray',color:0xFF});
  pageModifier.startContext().getContext().writeText(params.to.email,
                          80,
                          527,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:14,colorspace:'gray',color:0xFF});
  pageModifier.startContext().getContext().writeText(params.to.clientNum,
                          87,
                          499,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:12,colorspace:'gray',color:0xFF});
  pageModifier.startContext().getContext().writeText(params.to.clientNum,
                          197,
                          499,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:12,colorspace:'gray',color:0xFF});
  pageModifier.startContext().getContext().writeText(moment(params.to.date).format("MM/DD/YYYY"),
                          250,
                          499,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:12,colorspace:'gray',color:0xFF});

  //items
  var itemY = 362;
  _.each(params.items, function(item){
    if(item.service){
      pageModifier.startContext().getContext().writeText(item.service,
                            55,
                            itemY,
                            {font:pdfWriter.getFontForFile('./fonts/steelfish_rg.otf'),size:28,colorspace:'gray',color:0xFF});
      pageModifier.startContext().getContext().writeText("$" + item.pricePer.toString(),
                            327,
                            itemY,
                            {font:pdfWriter.getFontForFile('./fonts/steelfish_rg.otf'),size:28,colorspace:'gray',color:0xFF});
      pageModifier.startContext().getContext().writeText(item.amount,
                            420,
                            itemY,
                            {font:pdfWriter.getFontForFile('./fonts/steelfish_rg.otf'),size:28,colorspace:'gray',color:0xFF});
      pageModifier.startContext().getContext().writeText("$" + item.total.toString(),
                            495,
                            itemY,
                            {font:pdfWriter.getFontForFile('./fonts/steelfish_rg.otf'),size:28,colorspace:'gray',color:0xFF});
    }
    itemY -= 85;
  });

  //Total
  pageModifier.startContext().getContext().writeText("$" + params.total.toString(),
                          415,
                          37,
                          {font:pdfWriter.getFontForFile('./fonts/Futura.ttc'),size:25,colorspace:'gray',color:0xFF});
  

  pageModifier.endContext().writePage();

  pdfWriter.end();

  fs.readFile('./pdf/new_invoice_template.pdf', function (err,data){
     res.contentType("application/pdf");
     res.send(data);
  });
});



module.exports = router;
