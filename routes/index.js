var express = require('express');
var hummus = require('hummus');
var _ = require('underscore');
var moment = require('moment');
var fs = require('fs');
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
