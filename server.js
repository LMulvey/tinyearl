const express = require('express');
const app = express();
const env = require('dotenv').config();
app.set('view engine', 'ejs');

if(env.error) return console.log('FATAL ERROR: dotenv file not found.');


// # Routes
// ########
app.get('/', (req, res) => {
  res.send('Root Route');
});

app.get('/ejstest', (req, res) => {
  let data = [];
  data['page_title'] = "EJS Page Test by Lee";
  data['urls'] = [
    {'url': "http://tnerl.co/dogsEatingOtherDogs32"},
    {'url': "http://tnerl.co/whatsForDinner7643"},
    {'url': "http://tnerl.co/helpPolice01189998819991197253"}
  ];

  res.render('_header.ejs', data);

});

app.listen(process.env.LISTEN_PORT, () => {
  console.log('TinyEarl now listening on port ' + process.env.LISTEN_PORT + '!')
});