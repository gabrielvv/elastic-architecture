const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    os = require('os');
    // redis = require("redis"),
    // redisClient = redis.createClient({
    //   host: "redis",
    //   db: 0,
    // });

global.__root = __dirname + '/';

// redisClient.on("error", function (err) {
//     console.log("Error " + err);
// });

io.set('transports', ['polling']);

const port = process.env.PORT || 4000;
const option_a = process.env.OPTION_A || "Cats";
const option_b = process.env.OPTION_B || "Dogs";
const hostname = os.hostname();

io.sockets.on('connection', function (socket) {
  console.log("on connection")
  socket.emit('message', { text : 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

require(__root + "models")(app);

const {sequelize, User, Vote, initDB} = app.models;
const getVotesAndEmit = ()=>{
  Vote.findAll().then((votes)=>{
    votes = votes.reduce((o,v)=>{
      o[v.vote] = [v.vote] ? ++o[v.vote] : 0;
      return o;
    }, {a: 0, b: 0})
    // console.log("votes", votes);
    io.sockets.emit("scores", JSON.stringify(votes));
  })
  .then(()=>setTimeout(getVotesAndEmit, 1000))
  .catch(err=>console.error(err));
}
initDB(getVotesAndEmit)

require(__root + "middlewares")(app)
const PublicController = require(__root + "routes")(app);
const AuthController = require(__root + 'auth/AuthController')(app);
const VerifyToken = require(__root + 'auth/VerifyToken');
const Delay = require(__root + 'middlewares/Delay');
app.use(Delay);
app.use(AuthController);
app.use(PublicController);
app.use("/secure", VerifyToken);
app.use("/secure", PublicController);

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});
