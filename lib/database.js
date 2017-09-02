const config = require('./config.js'),
      utility = require('./utility.js');

// # Initialize flat database
// # Setup database (currently just an array)
exports.db.earls = {};
exports.db.users = {
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


// # Database Functions
exports.createEarl = (userid, longURL) => {
  let newEarl = utility.generateRandomEarl();
  // # Add to Earls database
  db.earls[newEarl] = { 
    userid : userid, 
    longURL : utility.appendHTTP(longURL) 
  };

  return db.earls[newEarl];
}

exports.authUser = function(users, email, password) {
    for(key in users) {
      if(users[key].email == email) {
        if(users[key].password == password) return users[key];
        else return config.ERRORS['login_failed'];
      } 
    }
    return config.ERRORS['login_failed'];
  }
  
exports.userExists = function(users, email) { 
    for(key in users) { 
      if(users[key].email == email) {
        return config.ERRORS['reg_user_exists'];
      }
    }
    return false;
  }
  