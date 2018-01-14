/**
* @see https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
* @see https://github.com/adnanrahic/securing-restful-apis-with-jwt
*
*/

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const VerifyToken = require('./VerifyToken');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = function(server){

const {User} = server.models;

router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    username : req.body.username,
    password : hashedPassword
  })
  .then((err, user) => {
    if (err) return res.status(500).send("There was a problem registering the user.")

    // create a token
    var token = jwt.sign({ id: user.username }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/me', VerifyToken, function(req, res, next) {
  User.findById(req.userId,
    // { password: 0 }, // projection
  )
  .then(user => {
      if (!user) return res.status(404).send("No user found.");
      res.status(200).send(user);
  })
  .catch(err=>res.status(500).send("There was a problem finding the user."))
});

router.post('/login/:delay', function(req, res) {
  const delay = parseInt(req.params.delay);
  if(delay > 0){
    setTimeout(()=>res.redirect('/login'),delay);
  } else {
    res.redirect('/login');
  }
});

router.post('/login', function(req, res) {

  // equivalent de findById(req.body.username)
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (!user) return res.status(404).send('No user found.');
    console.log(req.body.password, user.password)
    // https://github.com/kelektiv/node.bcrypt.js
    var passwordIsValid = bcrypt.compareSync(/*plain*/req.body.password, /*hash*/user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user.username }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  })
  .catch(err=>{
    console.error(err)
    return res.status(500).send('Error on the server.');
  });

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

return router;
}//module.exports
