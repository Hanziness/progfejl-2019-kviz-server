const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

var quizSchema = new mongoose.Schema(
  {
    quiz_nev: { type: String, unique: true, required: true },
    kerdesek: [
      { leiras: String, valaszok: [{ nev: String, helyes: Boolean }] },
    ],
  },
  { collection: 'quizes' }
)


quizSchema.methods.addNewQuiz = function(qName, qKerdesek) {
  return new Quiz({quiz_nev: qName, kerdesek: qKerdesek})
}
quizSchema.methods.deleteQuiz = function(qName, next) {
  return Quiz.deleteOne({ name: qName }, next);
}

quizSchema.methods.findQuiz = function(qName, next) {
  return Quiz.find({ name: qName});
}

quizSchema.methods.findAll = function() {
  
}

mongoose.model('quiz', quizSchema)