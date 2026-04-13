const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDb } = require('../db');
const { getCache, setCache, deleteCache } = require('../cache');

const PRODUCTS_CACHE_KEY = 'products:list';
const CACHE_TTL_SECONDS = 120;

router.get('/', async (req, res, next) => {
  try {
    const forceRefresh = req.query.forceRefresh === 'true';
    if (!forceRefresh) {
      const cachedProducts = await getCache(PRODUCTS_CACHE_KEY);
      if (cachedProducts) {
        return res.json({
          source: 'redis',
          cached: true,
          products: JSON.parse(cachedProducts),
        });
      }
    }

    const db = getDb();
    const products = await db.collection('products').find().toArray();

    await setCache(PRODUCTS_CACHE_KEY, JSON.stringify(products), CACHE_TTL_SECONDS);

    res.json({
      source: 'mongodb',
      cached: false,
      products,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product id.' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Request body must include at least one field to update.' });
    }

    const db = getDb();
    const collection = db.collection('products');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await deleteCache(PRODUCTS_CACHE_KEY);

    res.json({
      updated: true,
      product: result.value,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
