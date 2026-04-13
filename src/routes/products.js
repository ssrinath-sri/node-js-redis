const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { getCache, setCache } = require('../cache');

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

module.exports = router;
