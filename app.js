// # Modules
const utility = require('./lib/utility.js'),
      db = require('./lib/database.js'),
      config = require('./lib/config.js');

// # Setup Express
const express = require('express'),
      app = express();

// # Setup Custom Error-handling
const error = require('./lib/errors.js');
app.use(error.handler);


// # Setup cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// # Setup dotenv w/ basic error-handling
const env = require('dotenv').config();
if(env.error) return console.log('FATAL ERROR: dotenv file not found.');

// # Setup body-parser to handle POST requests (assigned to req.body)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// # Set Express view-engine to utilize EJS
app.set('view engine', 'ejs');
let view = {
  ejs : {
    urls : db.earls,
    error : config.ERRORS,
    register : false
  }
};

// ##########
// # Routes #
// ##########

// # '/' root
app.get('/', (req, res, next) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res, next) => {
  view.ejs.user = db.users[req.cookies['userid']];
  res.render('urls_index', view.ejs);
});

app.post('/urls', (req, res, next) => {
  let response = db.createEarl(req.cookies['userid'], req.body.longURL);
  console.log(response);
  res.redirect('/urls');
});

app.get('/urls/new', (req, res, next) => {
  view.ejs.user = db.users[req.cookies['userid']];
  res.render('urls_new', view.ejs);
});

app.get('/urls/:id', (req, res, next) => {
  if(db.earls[req.params.id].userid != req.cookies['userid']) {
    next('not_authorized');
  }

  // Setup template vars
  view.ejs.shortURL = req.params.id;
  view.ejs.longURL = db.earls[req.params.id].longURL;
  view.ejs.user = db.users[req.cookies['userid']];

  res.render('urls_show', view.ejs);
});

app.post('/urls/:id', (req,res) => {
  if(db.earls[req.params.id].userid != req.cookies['userid']) {
    error.handleError(ERRORS['not_authorized'].message);
  }
  db.earls[req.params.id].longURL = utility.appendHTTP(req.body.longURL);
  console.log(db.earls);
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res, next) => {
   if(db.earls[req.params.id].userid != req.cookies['userid']) {
    let err = error.handleError(ERRORS['not_authorized'].message);
    
  }
  db.deleteEarl(req.params.id);
  res.redirect('/urls');
})

app.post('/login', (req, res, next) => {
  let user = db.authUser(db.users, req.body.email, req.body.password);
  if(user.error) res.status(400).send(user.message);
  res.cookie('userid', user.id);
  res.redirect('/urls')
});

app.post('/logout', (req,res) => {
  res.clearCookie('userid');
  res.redirect('/urls');
});

app.get('/register', (req, res, next) => {
  view.ejs.register = true;
  view.ejs.user = db.users[req.cookies['userid']];
  res.render('register', view.ejs);
  view.ejs.register = false;
});

app.post('/register', (req, res, next) => {
  if(req.body.email == '' || req.body.password == '') res.status(400).send(config.ERRORS['reg_fields_empty'].message);

  let check = db.userExists(db.users, req.body.email);
  if(check.error) res.status(400).send(check.message);

  let userid = Object.keys(db.users).length+1;
  db.users[userid] = { 
    id: userid,
    email: req.body.email,
    password: req.body.password
  };
  
  res.cookie('userid', userid);
  console.log(db.users);
  res.redirect('/urls');
});

app.get('/u/:id', (req, res, next) => {
  res.redirect(db.earls[req.params.id].longURL);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});


