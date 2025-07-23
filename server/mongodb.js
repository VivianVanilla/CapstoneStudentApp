

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; 

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("capstonedata");
    console.log("Connected to MongoDB");
  }
  return db;
}

module.exports = connectDB;
