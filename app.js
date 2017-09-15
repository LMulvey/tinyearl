// # Modules
const utility = require('./lib/utility');
const db = require('./lib/database');
const config = require('./lib/config');

// # Setup Express
const express = require('express')
const app = express();

// # Setup cookie-session
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: utility.grabCookieKeys(),
  maxAge: 48 * 60 * 60 * 1000
}));

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

app.use('/urls', urlsRoute);
app.use('/u', shortRoute);
app.use('/', usersRoute);

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});