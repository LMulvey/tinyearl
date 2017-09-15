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
    let user = db.authUser(db.users, req.body.email, req.body.password);
    const templateVars = utility.defaultTemplateVars(req);
    // Error-handling
    if(user.error) {
      templateVars.errorcodes = [user.error];
      res.render('error_page', templateVars);
    }
  
    res.cookie('userid', user.id);
    res.redirect('/urls')
});
  
router.post('/logout', (req,res) => {
    res.clearCookie('userid');
    res.redirect('/urls');
});
  
router.get('/register', (req, res) => {
    const templateVars = utility.defaultTemplateVars(req);
    templateVars.user = db.users[req.cookies['userid']];
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

module.exports = router;