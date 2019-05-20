const mongoose = require('mongoose')
var userSchema = mongoose.model('user')

const quizFunctions = require('./quizFunctions')

exports.rankingUsers = function () {
  var allUsersArray = quizFunctions.findAllQuiz()
  allUsersArray.sort((user1, user2) => (user1.pontszam > user2.pontszam) ? 1 : -1)
  return allUsersArray
}