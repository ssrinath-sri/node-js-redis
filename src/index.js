require('dotenv').config();
const express = require('express');
const productsRouter = require('./routes/products');
const { connectToDatabase, closeDatabase } = require('./db');
const { connectRedis, disconnectRedis } = require('./cache');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Node.js + MongoDB + Redis sample project');
});

app.use('/products', productsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Unexpected error',
  });
});

async function startServer() {
  try {
    await connectToDatabase();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log('GET /products to see the product list');
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await disconnectRedis();
  await closeDatabase();
  process.exit(0);
});

startServer();
