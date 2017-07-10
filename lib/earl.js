var maxEarlIDLength = 15;


exports.generateEarlID = function() {
  /* Basic weird-word + numeral generator */
  /* ADD function to check if EARL ID already exists!!!! ***/

  var output = "";
  var words = [
  "Dog",
  "Cat",
  "Fink",
  "Dingus",
  "Donkey"
  ];

  for(var i = 0; i < 2; i++) {
    output += words[Math.floor(Math.random() * words.length)];
  }

  var remaining = maxEarlIDLength - output.length;

  for(var j = 0; j < remaining; j++) {
    output += (Math.floor(Math.random() * 10));
  }

  return output;

}

