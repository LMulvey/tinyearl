const config = require('./config.js'),
      utility = require('./utility.js');

// ##########################
// # Database Configuration #
// ##########################
// # Initialize flat database
exports.earlsDatabase = {
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
  console.log(newEarl);

  if(this.earlsDatabase[newEarl] != undefined) return this.CreateEarl(userid, longURL);

  // # Add to Earls database
  this.earlsDatabase[newEarl] = { 
    userid : userid, 
    longURL : utility.appendHTTP(longURL) 
  };

  return this.earlsDatabase[newEarl];
}

exports.deleteEarl = (id) => {
  delete this.earlsDatabase[id];
  return true;
}

exports.authUser = (email, password) => {
    for(key in this.users) {
      if(this.users[key].email == email) {
        if(this.users[key].password == password) return this.users[key];
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
  