const express = require("express"),
      router = express.Router(),
      path = require("path"),
      os = require("os"),
      multer = require('multer'), // v1.0.5
      upload = multer(); // for parsing multipart/form-data

const option_a = process.env.OPTION_A || "Cats";
const option_b = process.env.OPTION_B || "Dogs";
const hostname = os.hostname();

module.exports = function(app){

  const {Vote, User} = app.models;

  router.get("/", (req, res)=>res.send("Container ID : "+hostname));

  router.get("/vote", function (req, res) {
    res.render('./vote.ejs', {
      vote: null,
      option_a,
      option_b,
      hostname,
    });
  });

  // http://expressjs.com/fr/api.html#req.body
  router.post('/', upload.array(), function (req, res) {
    console.log("vote", {id: req.cookies.voterId, vote: req.body.vote})
    // TODO
    Vote
    .upsert({id: req.cookies.voterId, vote: req.body.vote})
    .catch(err=>console.error(err))
    .then((created) => {
      console.log("created", !!created)
      res.redirect("/vote")
      /*
       findOrCreate returns an array containing the object that was found or created and a boolean that will be true if a new object was created and false if not, like so:

      [ {
          username: 'sdepold',
          job: 'Technical Lead JavaScript',
          id: 1,
          createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
          updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
        },
        true ]

   In the example above, the "spread" on line 39 divides the array into its 2 parts and passes them as arguments to the callback function defined beginning at line 39, which treats them as "user" and "created" in this case. (So "user" will be the object from index 0 of the returned array and "created" will equal "true".)
      */
    })
  });

  router.get('/result', function (req, res) {
    res.redirect("/result.html");
  });

  return router;
}
