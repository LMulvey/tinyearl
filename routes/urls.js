// # Modules
const utility = require('../lib/utility');
const db = require('../lib/database');
const config = require('../lib/config');

// # Setup Express
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    utility.authCheck(req, res);

    const templateVars = utility.defaultTemplateVars(req);
    templateVars.urls = db.grabUserUrls(db.users[req.cookies['userid']]);
    console.log(templateVars.urls);
    res.render('urls_index', templateVars);
  });
  
router.post('/', (req, res) => {
  let response = db.createEarl(req.cookies['userid'], req.body.longURL);
  console.log(response);
  res.redirect('/urls');
});
  
router.get('/new', (req, res) => {
  utility.authCheck(req,res);
  res.render('urls_new', utility.defaultTemplateVars(req));
});

router.get('/:id', (req, res) => {
    const templateVars = utility.defaultTemplateVars(req);
    templateVars.user = db.users[req.cookies['userid']];

    utility.authCheck(req,res);

    // Setup template vars
    templateVars.shortURL = req.params.id;
    templateVars.longURL = db.earlsDatabase[req.params.id].longURL;

    res.render('urls_show', templateVars);
});

router.post('/:id', (req,res) => {
  utility.authCheck(req,res);

  db.earlsDatabase[req.params.id].longURL = utility.appendHTTP(req.body.longURL);
  res.redirect('/');
});

router.post('/:id/delete', (req, res) => {
  utility.authCheck(req,res);
  
  db.deleteEarl(req.params.id);
  res.redirect('/');
});

module.exports = router;