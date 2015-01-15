'use strict';
var getOutput = require('./wardInformationScrapper') //provides dict of names
var Summoner = require('./summoners.model');
var smtpTransport = require("./mailer");

var _ = require('lodash');

// Get list of things
exports.index = function(req, res) {
  Summoner.find({show: true}, function (err, summoner) {
    if (err) return console.error(err);
    return res.send(200, summoner);
  })
};

exports.clear = function(req, res){
  Summoner.update({show: true}, {show:false}, { multi: true }, function (err, summoner) {
    console.log("DBCleared");
  });
  res.redirect('/');
}

exports.getInfo = function(req, res) {
  var summonerName = req.param('name');
  console.log(summonerName);
  console.log(req);
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
      var list = ipAddr.split(",");
      ipAddr = list[list.length-1];
  } else {
      ipAddr = req.connection.remoteAddress;
  }

  getOutput(summonerName)(
    function (callback) {
      res.send(callback)
      summonerName = callback[0]
      var mailOptions = {
        from: "Wards Notifier<ryanwardapp@gmail.com>", // sender address
        to: "ryanwardapp@gmail.com", // list of receivers
        subject: "Automated Information", // Subject line
        text: ipAddr + " requested for Summoner: " + summonerName, // plaintext body
        html: ipAddr + " requested for Summoner: " + summonerName // html body
      }
      smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      });

    },
    function (err){
      res.send(405, err);
      var mailOptions = {
          from: "Wards<ryanwardapp@gmail.com>", // sender address
          to: "ryanwardapp@gmail.com", // list of receivers
          subject: "Automated Information", // Subject line
          text: ipAddr + " requested for Summoner: " + summonerName + ".  Unfortunately it failed", // plaintext body
          html: ipAddr + " requested for Summoner: " + summonerName + ".  Unfortunately it failed"// html body
      }
      smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      });
    }
  );
};

function handleError(res, err) {
  return res.send(500, err);
}
