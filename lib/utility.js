const config = require('./config');
const db = require('./database');

const express = require('express');

// #####################
// # Utility Functions #
// #####################
exports.generateRandomEarl = () => {
  /* Basic weird-word + numeral generator */
  /* ADD function to check if EARL ID already exists!!!! ***/
  
    let output = "",
    remaining = config.MAX_EARL_LENGTH - output.length;
  
    const words = [
      "goofy", "guilty", "doggy", "tails", "barf","dingus","drab","grab","baby","baboose",
      "bambino","bingo","taint","chode","kitty","shitty","jitter","dilf","that","diggity",
      "dog","cat","kitten","debt","you","cant","forgive","what","forget","father","mother",
      "house","holy","war","salesman","squirtdog","tie","bye","nye","wye","rye","windowsil",
      "see","arcade","management","manager","fuckboi","crazy","wacky","ridiculous",
      "ridonkulus","set","me","free","breathe","worldwar3","bestkorea","trump","trumpf",
      "dumpf","drumpf","drompf","trompf","tromp","cromp","krampus","krimpus","kritten","krog",
      "kraggle","draggle","toggle","boggle","bogglee","propane","propaneaccessories",
      "accessories","scrabble","scrobble","yourairy","urarey","ahhaa"
    ];
  
    for(let i = 0; i < 2; i++) {
      output += this.properCase(words[Math.floor(Math.random() * words.length)]);
    }
  
    for(let j = 0; j < remaining; j++) {
      output += (Math.floor(Math.random() * 10));
    }
  
    return output.substr(0, config.MAX_EARL_LENGTH-1);
  
  }
  
exports.appendHTTP = (str) => {
    if(str.substr(0,7) == "http://" || str.substr(0,8) == "https://") return str;
    else return "http://" + str;
}
  
exports.properCase = (str) => {
    return str.split(' ')
     .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
     .join(' ')
}

exports.defaultTemplateVars = (req) => {
  return { 
      error : config.ERRORS,
      success : config.SUCCESS,
      successcode : null,
      register : false,
      user: db.users[req.session.userid]
  };
}

exports.authCheck = (req, res) => {
    const templateVars = this.defaultTemplateVars(req);

    if(req.session.userid == null) {
      templateVars.errorcodes = ['not_logged_in'];
      res.render('error_page', templateVars);
    } else if(req.params.id != null && 
              db.earlsDatabase[req.params.id].userid != req.session.userid) {
      templateVars.errorcodes = ['not_authorized'];
      res.render('error_page', templateVars);
    }
}

exports.grabCookieKeys = () => {
  // 4 COOKIE_KEYs in .env
  let cookie_array = [
    String(process.env.COOKIE_KEY1), String(process.env.COOKIE_KEY2),
    String(process.env.COOKIE_KEY3), String(process.env.COOKIE_KEY4),
  ];
  return cookie_array;
}

