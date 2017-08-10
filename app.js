// # Setup Express
const express = require('express');
const app = express();

// # Setup dotenv w/ basic error-handling
const env = require('dotenv').config();
if(env.error) return console.log('FATAL ERROR: dotenv file not found.');

// # Setup body-parser to handle POST requests (assigned to req.body)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// # Setup database (currently just an array)
let earlDatabase = {};

// # Set Express view-engine to utilize EJS
app.set('view engine', 'ejs');

// # Options (intergers are not allowed inside dotenv)
const MAX_EARL_LENGTH = 15;

// ##########
// # Routes #
// ##########

// # '/' root
app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: earlDatabase };
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
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: earlDatabase[req.params.id] };
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

app.get("/u/:id", (req, res) => {
  res.redirect(earlDatabase[req.params.id]);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});


// #############
// # Functions #
// #############

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