// # Setup Express
const express = require('express');
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

// # Setup database (currently just an array)
const earlDatabase = {};
const users = {
  1: {
    id: 1,
    email: 'lmulvey@me.com',
    password: 'dogs'
  },
  2: {
    id: 2,
    email: 'dogs@dogs.com',
    password: '123'
  }
};

// # Options (intergers are not allowed inside dotenv)
const MAX_EARL_LENGTH = 10;
const ERRORS = {
  'not_logged_in' : { 
    error: 'not_logged_in',
    message: "You must be logged in to perform this. Either login or register using the above links."
  },
  'invalid_route' : {
    error: 'invalid_route',
    message: "The page you have requested does not exist."
  },
  'login_failed' : {
    error: 'login_failed',
    message: "The account information provided does not match our records. Please check the email and password."
  },
  'already_logged_in' : {
    error: 'already_logged_in',
    message: "You're already logged in so whatever you're trying to do makes no sense!"
  },
  'reg_fields_empty' : {
    error: 'reg_fields_empty',
    message: "You must fill out all required fields. Please try again."
  },
  'reg_user_exists' : {
    error: 'reg_user_exists',
    message: "This email is already registered. If it belongs to you, try logging in."
  }
};

// # Set Express view-engine to utilize EJS
app.set('view engine', 'ejs');
let view = {
  ejs : {
    urls : earlDatabase,
    error : ERRORS,
    register : false
  }
};

// ##########
// # Routes #
// ##########

// # '/' root
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  view.ejs.user = users[req.cookies['userid']];
  res.render("urls_index", view.ejs);
});

app.post("/urls", (req, res) => {
  let newEarl = generateRandomEarl();

  // # Add to Earls database
  earlDatabase[newEarl] = { userid : req.cookies['userid'], longURL : appendHTTP(req.body.longURL) };
  console.log(earlDatabase);
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  view.ejs.user = users[req.cookies['userid']];
  res.render("urls_new", view.ejs);
});

app.get("/urls/:id", (req, res) => {
  view.ejs.shortURL = req.params.id;
  view.ejs.longURL = earlDatabase[req.params.id];
  view.ejs.user = users[req.cookies['userid']];

  res.render("urls_show", view.ejs);
});

app.post("/urls/:id", (req,res) => {
  earlDatabase[req.params.id].longURL = appendHTTP(req.body.longURL);
  console.log(earlDatabase);
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete earlDatabase[req.params.id];
  res.redirect('/urls');
})

app.post("/login", (req, res) => {
  let user = authUser(req.body.email, req.body.password);
  if(user.error) res.status(400).send(user.message);
  res.cookie('userid', user.id);
  res.redirect('/urls')
});

app.post("/logout", (req,res) => {
  res.clearCookie('userid');
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  view.ejs.register = true;
  view.ejs.user = users[req.cookies['userid']];
  res.render("register", view.ejs);
  view.ejs.register = false;
});

app.post("/register", (req, res) => {
  if(req.body.email == '' || req.body.password == '') res.status(400).send(ERRORS['reg_fields_empty'].message);

  let check = userExists(req.body.email);
  if(check.error) res.status(400).send(check.message);

  let userid = Object.keys(users).length+1;
  users[userid] = { 
    id: userid,
    email: req.body.email,
    password: req.body.password
  };
  
  res.cookie('userid', userid);
  console.log(users);
  res.redirect('/urls');
});

app.get("/u/:id", (req, res) => {
  res.redirect(earlDatabase[req.params.id].longURL);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});


// #############
// # Functions #
// #############

function authUser(email, password) {
  for(key in users) {
    if(users[key].email == email) {
      if(users[key].password == password) return users[key];
      else return ERRORS['login_failed'];
    } 
  }
  return ERRORS['login_failed'];
}

function userExists(email) { 
  for(key in users) { 
    if(users[key].email == email) {
      return ERRORS['reg_user_exists'];
    }
  }
  return false;
}

function generateRandomEarl() {
/* Basic weird-word + numeral generator */
/* ADD function to check if EARL ID already exists!!!! ***/

  let output = "",
  remaining = MAX_EARL_LENGTH - output.length;

  const words = [
  "griffe",
  "syd",
  "wolds",
  "encl",
  "tour",
  "mmus",
  "reid",
  "ass",
  "fere",
  "whap",
  "geest",
  "slap",
  "splore",
  "tache",
  "shed",
  "verb",
  "kuyp",
  "stove",
  "youth",
  "spa",
  "raab",
  "strook",
  "hoogh",
  "theirs",
  "shrew",
  "spike",
  "jiao",
  "game",
  "crum",
  "bish",
  "loyce",
  "twelve",
  "frons",
  "paur",
  "hills",
  "hin",
  "dorr",
  "joual",
  "briggs",
  "flesh",
  "flank",
  "cal",
  "lime",
  "flem",
  "grange",
  "chaw",
  "poe",
  "dark",
  "belg",
  "ziff"
  ];

  for(let i = 0; i < 2; i++) {
    output += properCase(words[Math.floor(Math.random() * words.length)]);
  }

  for(let j = 0; j < remaining; j++) {
    output += (Math.floor(Math.random() * 10));
  }

  return output.substr(0,MAX_EARL_LENGTH-1);

}

function appendHTTP(str) {
  if(str.substr(0,7) == "http://" || str.substr(0,8) == "https://") return str;
  else return "http://" + str;
}

function properCase(str) {
  return str.split(' ')
   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
   .join(' ')
}