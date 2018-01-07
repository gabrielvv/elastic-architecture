const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    crypto = require('crypto'),
    morgan = require("morgan");

module.exports = function(app){

  // secure endpoint requires auth with JWT
  // app.use(function(req, res, next){
  // next()
  // })

  app.set('view engine', 'ejs');
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(morgan("combined"));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
  });

  app.use(function(req, res, next) {
    if(!req.cookies.voterId)
    {
      const voterId = crypto.randomBytes(64).toString('hex');
      req.cookies.voterId = voterId;
      res.cookie("voterId", voterId);
    }
    next();
  });

  app.use(express.static(__dirname + '/../views'));
}//exports
