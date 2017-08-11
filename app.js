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

// # Set Express view-engine to utilize EJS
app.set('view engine', 'ejs');

// # Options (intergers are not allowed inside dotenv)
const MAX_EARL_LENGTH = 10;

// ##########
// # Routes #
// ##########

// # '/' root
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: earlDatabase, user: users[req.cookies['userid']] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let newEarl = generateRandomEarl();
  let longURL = appendHTTP(req.body.longURL);

  // # Add to Earls database
  earlDatabase[newEarl] = longURL;
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies['userid']] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, 
                       longURL: earlDatabase[req.params.id],
                       user: users[req.cookies['userid']] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req,res) => {
  earlDatabase[req.params.id] = appendHTTP(req.body.longURL);
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete earlDatabase[req.params.id];
  res.redirect('/urls');
})

app.post("/login", (req, res) => {
  let user = loginUser(req.body.email, req.body.password);
  if(user.error) console.log(user.message); 
  res.cookie('userid', user.id);
  res.redirect('/urls')
});

app.post("/logout", (req,res) => {
  res.clearCookie('userid');
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  if(req.body.email == '' || req.body.password == '') res.status(400).send('Email or Password fields are empty.');
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
  res.redirect(earlDatabase[req.params.id]);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});


// #############
// # Functions #
// #############

function loginUser(email, password) {
  for(key in users) {
    if(users[key].email == email) {
      if(users[key].password == password) return users[key];
      else return { error: 'wrong_password', message: 'Incorrect password.' };
    } 
  }
  return { error: 'invalid_email', message: 'Email not registered.' };
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