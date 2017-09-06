const config = require('./config.js'),
      utility = require('./utility.js');

// ##########################
// # Database Configuration #
// ##########################

// # Initialize flat database
// # Setup database (currently just an array)
exports.earls = {
  beefy: {
    userid: 77,
    longURL: 'http://www.google.ca'
  }
};
exports.users = {
    1: {
        id: 1,
        email: 'lmulvey@me.com',
        password: 'dogs'
    },
    2: {
        id: 2,
        email: 'dogs@dogs.com',
        password: '123'
    }
};

// ######################
// # Database Functions #
// ######################

exports.createEarl = (userid, longURL) => {
  let newEarl = utility.generateRandomEarl();
  // # Add to Earls database
  this.earls[newEarl] = { 
    userid : userid, 
    longURL : utility.appendHTTP(longURL) 
  };

  return this.earls[newEarl];
}

exports.deleteEarl = (id) => {
  delete this.earls[id];
  return true;
}

exports.authUser = (users, email, password) => {
    for(key in users) {
      if(users[key].email == email) {
        if(users[key].password == password) return users[key];
        else return config.ERRORS['login_failed'];
      } 
    }
    return config.ERRORS['login_failed'];
}
  
exports.userExists = (users, email) => { 
    for(key in users) { 
      if(users[key].email == email) {
        return config.ERRORS['reg_user_exists'];
      }
    }
    return false;
}
  