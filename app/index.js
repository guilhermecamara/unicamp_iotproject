//carrega dependencias
var express = require('express');
var fs = require('fs');
var mustache = require('mustache');

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var templatebuilder = require('./utility/templatebuilder')
var config = require('./config/config');
var routes = require('./routes');
var configDB = require('./config/database.js');

require('./config/passport')(passport); // passa passport para ser configurado

// adiciona chaves de configuracoes no objeto config da aplicacao
config.appPath = __dirname;
config.port = 8081;

var app = express();
var render = templatebuilder(config, fs, mustache);

// set up our express application
app.set('view engine', 'mustache'); // set up mustache for templating
//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(config.appPath + '/static_content'));

// required for passport
app.use(session({ 
	secret: '879Uhas789Hnuiaoiqwue8712asSidA',
	resave: false,
    saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// configuracoes
mongoose.connect(configDB.url); // connect to our database
routes(config, app, passport, render);

//inicia servico
app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port + '!');
});
