// # Modules
const utility = require('../lib/utility');
const db = require('../lib/database');
const config = require('../lib/config');

// # Setup Express
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    res.redirect(db.earlsDatabase[req.params.id].longURL);
  });

module.exports = router;