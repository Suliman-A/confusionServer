const Dishes = require('../models/dishes');

const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dishes.find({}).populate('comments.author');
    res.status(200).json(dishes);
  } catch (err) {
    next(err);
  }
};

const createDish = async (req, res, next) => {
  try {
    const dish = await Dishes.create(req.body);
    console.log('Dish created ', dish);
    res.status(200).json(dish);
  } catch (err) {
    next(err);
  }
};

const updateDish = async (req, res) => {
  res.status(403).end('PUT operation not supported on /dishes');
};

const deleteDishes = async (req, res, next) => {
  try {
    const dishes = await Dishes.remove({});
    res.status(200).json(dishes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDishes, createDish, updateDish, deleteDishes,
};
