const mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

var quizSchema = new mongoose.Schema(
  {
    _id: ObjectId,
    quiz_nev: { type: String, required: true },
    kerdesek: [
      { leiras: String, valaszok: [{ nev: String, helyes: Boolean }] },
    ],
  },
  { collection: 'Quizes' }
)

mongoose.model('quiz', quizSchema)