const mongoose = require('mongoose')
var userSchema = mongoose.model('user')

const quizFunctions = require('./quizFunctions')

module.exports.rankingUsers = function () {
  var allUsersArray = quizFunctions.findAllQuiz() // TODO ezek így kvízek
  // TODO TypeError: Invalid sort() argument. Must be a string, object, or array.
  allUsersArray.sort((user1, user2) => (user1.pontszam > user2.pontszam) ? 1 : -1)
  return allUsersArray
}

module.exports.updateScore = function(name, score) {
  // TODO
  console.log(name + " " + score);
}

module.exports.findOneUser = function(name) {
  return userSchema.find({ username: name})
}