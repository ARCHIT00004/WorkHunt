const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let inMemoryServer = null;

async function connectToDatabase() {
  const envUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/workhunt';
  mongoose.set('strictQuery', true);
  try {
    const uriToUse = envUri || fallbackUri;
    await mongoose.connect(uriToUse, { autoIndex: true, serverSelectionTimeoutMS: 2500 });
    return;
  } catch (err) {
    // No local MongoDB; spin up in-memory server
    inMemoryServer = await MongoMemoryServer.create();
    const uri = inMemoryServer.getUri();
    await mongoose.connect(uri, { autoIndex: true });
  }
}

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (inMemoryServer) await inMemoryServer.stop();
  process.exit(0);
});

module.exports = { connectToDatabase };


