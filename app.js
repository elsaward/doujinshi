var express = require('express');
var path = require('path');
var User = require('./models/user');
var quiz = require('./models/quiz');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/list', function(req, res) {
  User.list(function(list) {
    res.render('list', {
      list: list
    });
  });
});

app.get('/quiz', function(req, res) {
  fs.readFile('./quiz.json', 'utf-8', function(err, data) {
    if(err) throw err;
    else res.json(JSON.parse(data));
  });
});

app.post('/answer', function(req, res) {
  if(quiz(req.body.qnum, req.body.answer)) {
    res.json({
      code: 1
    });
  } else {
    res.json({
      code: 0
    });
  }
});

app.post('/booking', function(req, res) {
  var user = new User(req.body.name, req.body.email);
  user.save(function(err) {
    if(err) {
      res.json({
        code: 0
      });
    } else {
      res.json({
        code: 1
      });
    }
  });
});

app.listen(3001);