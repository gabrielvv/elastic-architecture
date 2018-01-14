const express = require('express');
const router = express.Router();

// router.get("/:path/:delay", function(req, res, next){
//   setTimeout(()=>res.redirect("/"+req.params.path), parseInt(req.params.delay));
// })
//
// router.post("/:path/:delay", function(req, res, next){
//   setTimeout(()=>res.redirect("/"+req.params.path), parseInt(req.params.delay));
// })

router.use((req, res, next)=>{
  const delay = req.param('delay');
  setTimeout(()=>next(), delay ? parseInt(delay) : 0);
})

module.exports = router;
