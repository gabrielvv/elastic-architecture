const express = require('express'),
    async = require('async'),
    pg = require("pg"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    multer = require('multer'), // v1.0.5
    upload = multer(), // for parsing multipart/form-data
    os = require('os'),
    path = require("path"),
    redis = require("redis"),
    redisClient = redis.createClient({
      host: "redis",
      db: 0,
    }),
    crypto = require('crypto');

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

io.set('transports', ['polling']);

const port = process.env.PORT || 4000;
const option_a = process.env.OPTION_A || "Cats"
const option_b = process.env.OPTION_B || "Dogs"
const hostname = os.hostname()

io.sockets.on('connection', function (socket) {

  socket.emit('message', { text : 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

const connectToPG = function(callback) {
  pg.connect('postgres://postgres@db/postgres', function(err, client, done) {
    if (err) {
      console.error("Waiting for db");
    }
    callback(err, client);
  });
};

const getVotes = function(err, client) {
  if (err) {
    return console.err("Giving up");
  }
  console.log("Connected to db");

  client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], function(err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      var votes = collectVotesFromResult(result);
      console.log("votes from pg", votes)
      io.sockets.emit("scores", JSON.stringify(votes));
    }

    setTimeout(function() { getVotes(null, client) }, 1000);
  });
}

const createVoteTable = function(err, client){
  client.query("CREATE TABLE IF NOT EXISTS votes ( id VARCHAR(255) NOT NULL UNIQUE, vote VARCHAR(255) NOT NULL)",
    [],
    function(err, data){
      if (err) {
        console.error("Error performing query: " + err);
      } else {
        //OK
        getVotes(null, client)
      }
    }
  );
}

// https://caolan.github.io/async/docs.html#retry
async.retry(
  {times: 1000, interval: 1000},
  /* task */connectToPG,
  /* callback */createVoteTable // => calls getVotes if successful
);

function collectVotesFromResult(result) {
  console.log("result from db", result)
  var votes = {a: 0, b: 0};

  result.rows.forEach(function (row) {
    votes[row.vote] = parseInt(row.count);
  });

  return votes;
}

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());
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

app.use(express.static(__dirname + '/views'));

// secure endpoint requires auth with JWT
app.use(function(req, res){
  
})

// '/' ou '/vote'
app.get(/\/|\/vote/, function (req, res) {
  res.render('./vote.ejs', {
    vote: null,
    option_a,
    option_b,
    hostname,
  });
});

//   voter_id = request.cookies.get('voter_id')
//   if not voter_id:
//       voter_id = hex(random.getrandbits(64))[2:-1]
//
//   vote = None
//
//   if request.method == 'POST':
//       redis = get_redis()
//       vote = request.form['vote']
//       data = json.dumps({'voter_id': voter_id, 'vote': vote})
//       redis.rpush('votes', data)
//
//   resp = make_response(render_template(
//       'index.html',
//       option_a=option_a,
//       option_b=option_b,
//       hostname=hostname,
//       vote=vote,
//   ))
//   resp.set_cookie('voter_id', voter_id)
//   return resp

// http://expressjs.com/fr/api.html#req.body
app.post('/', upload.array(), function (req, res) {
  console.log("vote", req.body.vote)
  // redisClient.rpush("votes",
  //   {
  //     'voterId': req.cookies.voterId,
  //     'vote': req.body.vote
  //   },
  //   redis.print
  // );
  connectToPG((err,client)=>{
    if (err) {
      return console.err("Giving up");
    }
    console.log("Connected to db");

    client.query(`INSERT INTO votes (id, vote) VALUES ($1, $2)
                  ON CONFLICT (id) DO UPDATE
                  SET vote = $2`,
      [req.cookies.voterId, req.body.vote],
      function(err, result) {
        if (err) {
          res.status(500).send({ error: "Error performing query: " + err });
        } else {
          res.redirect("/vote");
        }
      }
    ); // client.query
  }); //connectToPG
});

app.get('/result', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/result.html'));
});

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});
