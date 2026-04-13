# Node.js + Redis + MongoDB Sample Project

This project demonstrates a simple Node.js HTTP server with MongoDB for persistent product storage and Redis for caching the product list.

## What is included

- `src/index.js` - Express HTTP server and startup logic
- `src/db.js` - MongoDB connection helper
- `src/cache.js` - Redis connection and cache helper
- `src/routes/products.js` - `/products` endpoint with Redis cache fallback
- `src/seed.js` - simple sample data seeding script
- `.gitignore` - ignores `node_modules` and `.env`

## Step-by-step explanation

1. Install dependencies with `npm install`.
2. Configure the environment using `.env` or default values.
3. Run `npm run seed` to insert sample products into MongoDB.
4. Start the server with `npm start`.
5. Call `GET /products` to fetch the saved product list.

### How Redis is used

- The first request to `/products` loads products from MongoDB.
- The product data is stored in Redis with a TTL (time to live) of 120 seconds.
- Subsequent requests return the cached response from Redis.
- Add `?forceRefresh=true` to bypass the cache and refresh the MongoDB result.

## Requirements

- Node.js 18+ installed
- MongoDB server running locally or reachable via connection string
- Redis server running locally or reachable via connection string

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```text
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=redis_node_sample
REDIS_URL=redis://127.0.0.1:6379
PORT=4000
```

3. Seed sample products:

```bash
npm run seed
```

4. Run the server:

```bash
npm start
```

5. Open the endpoint in your browser or API client:

```text
http://localhost:4000/products
```

6. Force refresh the Redis cache:

```text
http://localhost:4000/products?forceRefresh=true
```

## Helpful notes

- If MongoDB or Redis are not running locally, update `MONGODB_URI` and `REDIS_URL` in `.env`.
- The Redis cache key is `products:list` and expires after 120 seconds.
- The product endpoint returns a JSON body showing whether the data came from `redis` or `mongodb`.

## Example response

```json
{
  "source": "redis",
  "cached": true,
  "products": [
    {
      "_id": "...",
      "name": "Wireless Mouse",
      "price": 24.99,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

## Troubleshooting

- `ECONNREFUSED` from MongoDB: make sure MongoDB is running and the `MONGODB_URI` is correct.
- `Redis error`: make sure Redis is running and `REDIS_URL` is correct.
- If the server fails to start, inspect the console logs for the actual error.
