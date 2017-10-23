// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-example-passport
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 */
var bodyParser = require('body-parser');

/**
 * Flash messages for passport
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash      = require('express-flash');

// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

// -- Add your pre-processing middleware here --

// Setup the view engine (jade)
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// boot scripts mount components like REST API
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

//app.model(User_Profiles);

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

//app.get('/', function(req, res, next) {
app.get('/',ensureLoggedIn('/local'), function(req, res, next) {
  res.render('pages/app01', {user:
    req.user,
    url: req.url,
    site:{
		name : 'ES-Presales Timesheet Application',
		title:'Timesheet'
	},
	routes:[{ 
		path: '/',
		component: { 
			template: '<Timesheet source="/api/timesheets" uid=1></test1>' 
		}},{ 
		path: '/Jobend',
		component: { 
			template: '<Timesheet1 source="/api/timesheets" uid=1></test1>' 
			}},{ 
		path: '/Timesheet',
		component: { 
			template: '<div><h1> Timesheet</h1></div>' 
		}}
		],
		userapps:[
			{
				name:'Enterprise Application',
				href:'#',
				icont:'fa fa-th-large',
				menus:[
				{
					href:'#/',
					label:'Home'
				},{
					href:'#/Jobend',
					label:'Job End'
				}],
			}
		]
  });
});

app.get('/testpage', function(req, res, next) {
	  res.render('pages/testpage', {user:
	    req.user,
	    url: req.url,
	    site:{
			name : 'INSPINIA+ Admin Themexx.',
			title:'My App Title1 '
		},
		user:{
			name:'Wanchai Fuangmali',
			position:'Pre-Sales',
			profile_img:'img/profile_small.jpg',
			menus:[
				{
					href:'profile.html',
					label:'Profile'
				},{
					href:'contacts.html',
					label:'Contacts'
				}
			]
		},
		xpath:'#',
		routes:[{ 
			path: '/das1',
			component: { 
				template: '<async-example></async-example>' 
			}},{ 
			path: '/das2',
			component: { 
				template: '<div><h1> Dashboard v.2</h1></div>' 
			}},{
			path: '/report1',
			component: { 
				template: '<div><h1> Report v.1</h1></div>' 
			}},{
			path: '/report2',
			component: { 
				template: '<div><h1> Report v.2</h1></div>' 
			}}
			],
		userapps:[
			{
				name:'App1',
				href:'#',
				icont:'fa fa-th-large',
				menus:[
				{
					href:'#/das1',
					label:'Dashboard v.1'
				},{
					href:'#/das2',
					label:'Dashboard v.2'
				}],
			},
			{
				name:'App2',
				href:'#',
				icont:'fa fa-th-large',
				menus:[
				{
					href:'#/report1',
					label:'Report v.1'
				},
				{
					href:'#/report2',
					label:'Report v.2'
				}],
			}
		]
	  });
	});
app.get('/auth/account', ensureLoggedIn('/local'), function(req, res, next) {
  res.render('pages/app01', {
    user: req.user,
    url: req.url,
  });
});

app.get('/local', function(req, res, next) {
  res.render('pages/local', {
    user: req.user,
    url: req.url,
  });
});

app.get('/ldap', function(req, res, next) {
  res.render('pages/ldap', {
    user: req.user,
    url: req.url,
  });
});

app.get('/signup', function(req, res, next) {
  res.render('pages/signup', {
    user: req.user,
    url: req.url,
  });
});

app.post('/signup', function(req, res, next) {
  var User = app.models.user;

  var newUser = {};
  newUser.email = req.body.email.toLowerCase();
  newUser.username = req.body.username.trim();
  newUser.password = req.body.password;

  User.create(newUser, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    } else {
      // Passport exposes a login() function on req (also aliased as logIn())
      // that can be used to establish a login session. This function is
      // primarily used when users sign up, during which req.login() can
      // be invoked to log in the newly registered user.
      req.login(user, function(err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        return res.redirect('/auth/account');
      });
    }
  });
});

app.get('/login', function(req, res, next) {
  res.render('pages/login', {
    user: req.user,
    url: req.url,
  });
});

app.get('/auth/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
