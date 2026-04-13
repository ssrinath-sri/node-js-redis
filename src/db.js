const { MongoClient } = require('mongodb');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'redis_node_sample';

let client;
let database;

async function connectToDatabase() {
  if (database) {
    return database;
  }

  client = new MongoClient(mongoUrl, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  database = client.db(dbName);
  console.log(`Connected to MongoDB: ${mongoUrl}/${dbName}`);
  return database;
}

function getDb() {
  if (!database) {
    throw new Error('Database is not connected. Call connectToDatabase() first.');
  }
  return database;
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    database = null;
    console.log('MongoDB connection closed.');
  }
}

module.exports = {
  connectToDatabase,
  getDb,
  closeDatabase,
};
