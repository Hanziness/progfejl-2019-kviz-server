const mongoose = require('mongoose')
var quizSchema = mongoose.model('quiz')

module.exports.addNewQuiz = function(qId, qName, qKerdesek) {
  // qId = new String(qId);
  console.debug(qId + " is of type " + typeof qId);
  quizSchema.create({
    _id : mongoose.Types.ObjectId.createFromTime(Date.now()),
    quiz_nev: qName,
    kerdesek: qKerdesek
  })
}
module.exports.deleteQuiz = function(qName) {
  return quizSchema.deleteOne({ quiz_nev: qName })
}

module.exports.findOneQuiz = function(qId) {
  return quizSchema.findById(qId)
}

module.exports.findAllQuiz = function() {
  return quizSchema.find()
}
