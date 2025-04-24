const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const { search } = req.query;
  const filter = { owner: req.user._id };
  if (search) filter.title = new RegExp(search, 'i');
  res.json(await Recipe.find(filter));
});

router.post('/', async (req, res) => {
  const recipe = new Recipe({ ...req.body, owner: req.user._id });
  res.status(201).json(await recipe.save());
});

router.get('/:id', async (req, res) => {
  const rec = await Recipe.findOne({ _id:req.params.id, owner:req.user._id });
  if (!rec) return res.status(404).end();
  res.json(rec);
});

router.put('/:id', async (req, res) => {
  const upd = await Recipe.findOneAndUpdate(
    { _id:req.params.id, owner:req.user._id }, req.body,
    { new:true, runValidators:true }
  );
  if (!upd) return res.status(404).end();
  res.json(upd);
});

router.delete('/:id', async (req, res) => {
  await Recipe.findOneAndDelete({ _id:req.params.id, owner:req.user._id });
  res.status(204).end();
});

module.exports = router;