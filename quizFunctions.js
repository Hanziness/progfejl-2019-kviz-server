const mongoose = require('mongoose')
var quizSchema = mongoose.model('quiz')

module.exports.addNewQuiz = function(qId, qName, qKerdesek) {
  quizSchema.create({
    _id: qId,
    quiz_nev: qName,
    questions: qKerdesek
  })
}
module.exports.deleteQuiz = function(qName) {
  return quizSchema.deleteOne({ quiz_nev: qName })
}

module.exports.findOneQuiz = function(qName) {
  return quizSchema.find({ quiz_nev: qName})
}

module.exports.findAllQuiz = function() {
  return quizSchema.find()
}
