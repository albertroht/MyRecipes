const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recipes',
    required: true,
  },

  main: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Image', ImageSchema);
