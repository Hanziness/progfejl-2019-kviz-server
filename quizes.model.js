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

var Quiz = mongoose.model('quiz', quizSchema)

function addNewQuiz(qName, qKerdesek) {
  return new Quiz({quiz_nev: qName, kerdesek: qKerdesek})
}
function deleteQuiz(qName, next) {
  return Quiz.deleteOne({ name: qName }, next);
}

function findQuiz(qName, next) {
  return Quiz.find({ name: qName});
}