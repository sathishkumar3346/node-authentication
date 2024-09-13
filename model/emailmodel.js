const connectDB = require('../config/db');

async function getCollection(collectionName = 'email') {
  const db = await connectDB();
  return db.collection(collectionName);
}

module.exports = {
  getCollection
};
