require('dotenv').config();
const { connectToDatabase, closeDatabase } = require('./db');

const sampleProducts = [
  {
    name: 'Wireless Mouse',
    price: 24.99,
    category: 'electronics',
    inStock: true,
  },
  {
    name: 'Bluetooth Speaker',
    price: 49.5,
    category: 'electronics',
    inStock: true,
  },
  {
    name: 'Coffee Mug',
    price: 12.0,
    category: 'kitchen',
    inStock: true,
  },
  {
    name: 'Notebook',
    price: 6.5,
    category: 'stationery',
    inStock: false,
  },
];

async function seed() {
  const db = await connectToDatabase();
  const collection = db.collection('products');

  await collection.deleteMany({});
  const result = await collection.insertMany(sampleProducts);

  console.log(`Seeded ${result.insertedCount} products.`);
  await closeDatabase();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
