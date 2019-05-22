const mongoose = require('mongoose')
var userSchema = mongoose.model('user')

const quizFunctions = require('./quizFunctions')

module.exports.rankingUsers = function () {
  var allUsersArray = userSchema.find({
    admin: false
  }, {'username' : 1, 'pontszam': 1, '_id': 0}); // Csak a 'username' és 'pontszam' mezőket adja vissza

  return allUsersArray.sort({pontszam: 'descending'});
}

module.exports.updateScore = function(name, score) {
  
  score = Number.parseInt(score);
  userSchema.findOne({
    username: name
  }).exec((err, res) => {
    let currScore = Number.parseInt(res.pontszam);
    userSchema.updateOne({
      username: name
    }, {
      pontszam: currScore + score
    }).exec((err, res) => {
      console.debug("User " + name + " score updated to " + (currScore + score));
    })
  });
}

module.exports.findOneUser = function(name) {
  return userSchema.find({ username: name})
}