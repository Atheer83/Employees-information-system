var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require("./database/index");
var routes = require("./routes/index");

var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());
	app.use('/', routes);

app.use(session({
	secret: 'rbk student',
	resave: true,
  saveUninitialized: false,
}));

app.use(function (req, res, next) {
	res.locals.curentUser = req.session.userId;
	next();
});



app.listen(port);