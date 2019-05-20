const mongoose = require('mongoose')
var quizSchema = mongoose.model('quiz')

var addNewQuiz = function(qId, qName, qKerdesek) {
  quizSchema.create({
    _id: qId,
    quiz_nev: qName,
    questions: qKerdesek
  })
}
var deleteQuiz = function(qName) {
  return quizSchema.deleteOne({ quiz_nev: qName })
}

var findOneQuiz = function(qName) {
  return quizSchema.find({ quiz_nev: qName})
}

var findAllQuiz = function() {
  return quizSchema.find()
}


module.exports = {
  addNewQuiz: addNewQuiz,
  deleteQuiz: deleteQuiz,
  findOneQuiz: findOneQuiz,
  findAllQuiz: findAllQuiz
}
