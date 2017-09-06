const config = require('./config.js');

// #############
// # Functions #
// #############

exports.generateRandomEarl = () => {
  /* Basic weird-word + numeral generator */
  /* ADD function to check if EARL ID already exists!!!! ***/
  
    let output = "",
    remaining = config.MAX_EARL_LENGTH - output.length;
  
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

