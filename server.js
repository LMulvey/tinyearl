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



// # Routes
// ########

// # '/' root
app.get('/', (req, res) => {
  res.send('Root Route');
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/:id", (req, res) => {
  res.redirect(earlDatabase[req.params.id]);
});

app.post("/urls", (req, res) => {
  let newEarl = generateRandomEarl();
  let longURL = appendHTTP(req.body.longURL);
  
  // # Add to earls database
  earlDatabase[newEarl] = longURL;
  console.log(earlDatabase[newEarl]);
  res.send("Ok" + newEarl);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});



// # Functions
// ###########

function generateRandomEarl() {
  /* Basic weird-word + numeral generator */
  /* ADD function to check if EARL ID already exists!!!! ***/

  let output = "";
  const words = [
  "Dog",
  "Cat",
  "Fink",
  "Dingus",
  "Donkey"
  ];

  for(let i = 0; i < 2; i++) {
    output += words[Math.floor(Math.random() * words.length)];
  }

  var remaining = process.env.MAX_EARL_LENGTH - output.length;

  for(let j = 0; j < remaining; j++) {
    output += (Math.floor(Math.random() * 10));
  }

  return output;

}

function appendHTTP(str) {
  if(str.substr(0,6) !== "http://" || str.substr(0,7) !== "https://") return "http://" + str;
  else return str;
}