const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://sathish:admin123@cluster0.wfpkwch.mongodb.net/";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("sathish");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectDB;
