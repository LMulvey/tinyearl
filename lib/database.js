const config = require('./config.js'),
      utility = require('./utility.js');

// # Setup bcrypt
const bcrypt = require('bcrypt');

// ##########################
// # Database Configuration #
// ##########################
// # Initialize flat database
exports.earlsDatabase = {
  earlsTest: {
    userid: 77,
    longURL: 'http://www.google.ca'
  }
};

exports.users = {
    1: {
        id: 1,
        email: 'lmulvey@me.com',
        password: '$2a$06$MlsvzG8TTjb8ixmAnKBkEOE2W5dd1pSh7hHE1XY3fAewo8lllPUPe'
    },
    2: {
        id: 2,
        email: 'dogs@dogs.com',
        password: '$2a$06$//CY.1Ghw6tgr7C2SEkBk.AfE0NMNS.tP8kTZZsBxIcyIJFHrsS.O'
    }
};

// ######################
// # Database Functions #
// ######################

exports.createEarl = (userid, longURL) => {
  return new Promise((resolve, reject) => {
    let newEarl = utility.generateRandomEarl();
    if(this.earlsDatabase[newEarl] != undefined) return this.CreateEarl(userid, longURL);
    
    // # Add to Earls database
    this.earlsDatabase[newEarl] = { 
      userid : userid, 
      longURL : utility.appendHTTP(longURL) 
    };

    resolve(this.earlsDatabase[newEarl]);
  });
}

exports.modifyEarl = (id, longURL) => {
  this.earlsDatabase[id].longURL = utility.appendHTTP(longURL);
}

exports.deleteEarl = (id) => {
  delete this.earlsDatabase[id];
  return true;
}

exports.authUser = (email, password) => {
    for(key in this.users) {
      if(this.users[key].email == email) {
        if(bcrypt.compareSync(password, this.users[key].password)) return this.users[key];
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

exports.grabUserUrls = (user) => {
  const userUrls = [];
  for(k in this.earlsDatabase) {
    if(user.id == this.earlsDatabase[k].userid) {
      userUrls[k] = this.earlsDatabase[k];
    }
  }
  return userUrls;
}
  