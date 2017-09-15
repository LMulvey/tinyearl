// # Modules
const utility = require('../lib/utility');
const db = require('../lib/database');
const config = require('../lib/config');

// # Setup Express
const express = require('express');
const router = express.Router();

// # '/' root
router.get('/', (req, res) => {
    res.redirect('/urls');
});

router.post('/login', (req, res) => {
    let user = db.authUser(req.body.email, req.body.password);
    const templateVars = utility.defaultTemplateVars(req);

    console.log(user);
    
    // Error-handling
    if(user.error) {
      templateVars.errorcodes = [user.error];
      res.render('error_page', templateVars);
    }
  
    req.session.userid = user.id;
    console.log('Logged in?' + user.id);
    console.log('Req Session ID = ' + req.session.userid);
    res.redirect('/urls')
});
  
router.post('/logout', (req,res) => {
    delete req.session.userid;
    res.redirect('/urls');
});
  
router.get('/register', (req, res) => {
    const templateVars = utility.defaultTemplateVars(req);
    templateVars.user = db.users[req.session.userid];
    templateVars.register = true;
  
    if(templateVars.user != null) {
      templateVars.errorcodes = ['already_logged_in'];
      res.render('error_page', templateVars);
    }
  
    res.render('register', templateVars);
});
  
router.post('/register', (req, res) => {
    if(req.body.email == '' || req.body.password == '') res.status(400).send(config.ERRORS['reg_fields_empty'].message);
  
    let check = db.userExists(db.users, req.body.email);
    const templateVars = utility.defaultTemplateVars(req, res);

    // Error-handling
    if(check.error) {
      templateVars.errorcodes = [check.error];
      res.render('error_page', templateVars);
    }
  
    let userid = Object.keys(db.users).length+1;
    db.users[userid] = { 
      id: userid,
      email: req.body.email,
      password: req.body.password
    };
    
    req.session.userid = userid;
    console.log(db.users);
    res.redirect('/urls');
});

module.exports = router;