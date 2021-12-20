const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

  name: {
    type: String,
    required: true,
  },
  image: Buffer,
  filename: String,
  description: String,
  // tags: [],
  ingredients: [],
  instructions: [],
  difficulty: String,
  time: Number,
  portions: Number,
  type: {
    type: String,
    default: 'private',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('recipe', RecipeSchema);
