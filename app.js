// # Modules
const utility = require('./lib/utility');
const db = require('./lib/database');
const config = require('./lib/config');

// # Setup Express
const express = require('express')
const app = express();

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


// ##########
// # Routes #
// ##########
// Define those route files

const urlsRoute = require('./routes/urls');
const usersRoute = require('./routes/users');
const shortRoute = require('./routes/shorturls');

// # '/' root
app.get('/', (req, res, next) => {
  res.redirect('/urls');
});

app.use('/urls', urlsRoute);

app.post('/login', (req, res, next) => {
  let user = db.authUser(db.users, req.body.email, req.body.password);
  const templateVars = utility.defaultTemplateVars(req);
  // Error-handling
  if(user.error) {
    templateVars.errorcodes = [user.error.error];
    res.render('error_page', templateVars);
  }

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
  
  // Error-handling
  if(check.error) {
    view.ejs.errorcodes = [check.error.error];
    res.render('error_page', view.ejs);
  }

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
  res.redirect(db.earlsDatabase[req.params.id].longURL);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});


