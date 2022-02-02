const express = require('express');
const router = express.Router();
// const fs = require('fs').promises;
const auth = require('../middleware/auth');
const fileUpload = require('../middleware/fileUpload');
const Recipe = require('../models/Recipe');
const Image = require('../models/Image');
const ObjectId = require('mongodb').ObjectID;

// @route   GET api/recipes
// @desc    Get all users recipes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({
      date: -1,
    });

    const recipes_without_images = recipes.map(recipe => {
      const new_recipe = recipe.toJSON();
      delete new_recipe.image;
      return new_recipe;
    });

    res.json(JSON.stringify(recipes_without_images));
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/recipes/public
// @desc    Get all public recipes
// @access  Public
router.get('/public', async (req, res) => {
  try {
    let recipes = await Recipe.find({ type: 'public' }).sort({
      date: -1,
    });

    const recipes_without_images = recipes.map(recipe => {
      const new_recipe = recipe.toJSON();
      delete new_recipe.image;
      return new_recipe;
    });

    res.json(JSON.stringify(recipes_without_images));
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/recipes/:id
// @desc    Get private recipe
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(
      ObjectId.createFromHexString(req.params.id.slice(0, 24))
    );

    if (recipe.user == req.user.id || req.user.role === 'admin') {
      // const image = await Image.findOne({ recipe: recipe._id });
      // if (image && image._id) {
      //   try {
      //     const imageBuffer = await fs.readFile(`uploads/${image._id}.png`);
      //     recipe.image = imageBuffer;
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }

      console.log(recipe);
      res.json(JSON.stringify(recipe));
    } else {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/recipes/public/:id
// @desc    Get public recipe
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(
      ObjectId.createFromHexString(req.params.id.slice(0, 24))
    );
    if (recipe.type == 'public') {
      res.json(JSON.stringify(recipe));
    } else {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/recipes/public/:id
// @desc    Get public recipe image
// @access  Public
router.get('/public/image/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(
      ObjectId.createFromHexString(req.params.id.slice(0, 24))
    );

    if (recipe.type == 'public') {
      // const image = await Image.findOne({ recipe: recipe._id });
      // if (image && image._id) {
      //   try {
      //     const imageBuffer = await fs.readFile(`uploads/${image._id}.png`);
      //     recipe.image = imageBuffer;
      //     const recipe_json = recipe.toJSON();
      //     res.json(JSON.stringify(recipe_json.image));
      //   } catch (error) {
      //     console.log(error);
      //   }
      if (recipe.image) {
        res.json(JSON.stringify(recipe.image));
      } else {
        res.status(200).send('');
      }
    } else {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/recipes/private/:id
// @desc    Get private recipe image
// @access  Public
router.get('/private/image/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(
      ObjectId.createFromHexString(req.params.id.slice(0, 24))
    );

    // Make sure user owns recipe
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (recipe.image) {
      // const image = await Image.findOne({ recipe: recipe._id });
      // if (image && image._id) {
      //   try {
      //     const imageBuffer = await fs.readFile(`uploads/${image._id}.png`);
      //     recipe.image = imageBuffer;
      //     const recipe_json = recipe.toJSON();
      //     res.json(JSON.stringify(recipe_json.image));
      //   } catch (error) {
      //     console.log(error);
      //     res.status(500).send('Server error');
      //   }
      res.send(JSON.stringify(recipe.image));
    } else {
      res.status(200).send('');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   POST api/recipes
// @desc    add new recipe
// @access  Private
router.post('/', [auth, fileUpload.single('image')], async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...JSON.parse(req.body.recipe),
      user: req.user.id,
    });

    let recipeImage = '';
    if (req.file) {
      newRecipe.image = req.file.buffer;
      recipeImage = req.file.buffer;
    }

    const recipe = await newRecipe.save();
    delete recipe.image;

    // TODO: save files elsewhere and refere to savepath in db
    // let recipeImage = '';
    // if (req.file) {
    //   // recipeImage = req.file;
    //   const NewImage = new Image({
    //     recipe: recipe._id,
    //   });
    //   const image = await NewImage.save();

    //   await fs.writeFile(
    //     `uploads/${image._id}.png`,
    //     req.file.buffer,
    //     'base64',
    //     function (err) {
    //       console.log(err);
    //     }
    //   );

    //   recipeImage = await fs.readFile(`uploads/${image._id}.png`);
    // }

    res.json({ recipe, recipeImage });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/recipes/:id
// @desc    Update recipe
// @access  Private
router.put('/:id', [auth, fileUpload.single('image')], async (req, res) => {
  try {
    const recipeFields = { ...JSON.parse(req.body.recipe) };
    let recipe = await Recipe.findById(req.params.id);
    // let image;
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Make sure user owns recipe
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (req.file) {
      // imageObject = await Image.findOne({ recipe: recipe._id });
      // let image_id;
      // if (imageObject) {
      //   image_id = imageObject._id;
      // } else {
      //   const newImage = new Image({ recipe: recipe._id });
      //   await newImage.save();
      //   image_id = newImage._id;
      // }

      // await fs.writeFile(
      //   `uploads/${image_id}.png`,
      //   req.file.buffer,
      //   'base64',
      //   function (err) {
      //     console.log(err);
      //   }
      // );

      // const imageBuffer = await fs.readFile(`uploads/${image_id}.png`);
      recipeFields.image = req.file.buffer;
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: recipeFields },
      { new: true }
    );

    if (req.file) {
    }
    delete recipe.image;
    res.json({ recipe, image: recipe.image });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// @route   Delete api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    // Make sure user owns recipe
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // const images = await Image.find({ recipe: recipe._id });
    // images.forEach(image => {
    //   fs.unlink(`uploads/${image._id}.png`);
    // });
    // await Image.deleteMany({ recipe: recipe._id });
    await Recipe.findByIdAndRemove(recipe._id);
    res.json({ msg: 'Recipe deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
