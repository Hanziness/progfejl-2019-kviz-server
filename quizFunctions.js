const mongoose = require('mongoose')
var quizSchema = mongoose.model('quiz')

exports.addNewQuiz = function(qId, qName, qKerdesek) {
  quizSchema.create({
    _id: qId,
    quiz_nev: qName,
    questions: qKerdesek
  })
}
exports.deleteQuiz = function(qName) {
  return quizSchema.deleteOne({ quiz_nev: qName })
}

exports.findOneQuiz = function(qName) {
  return quizSchema.find({ quiz_nev: qName})
}

exports.findAllQuiz = function() {
  return quizSchema.find()
}
