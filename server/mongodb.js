

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://vivianbonilla:8DU9JlJXPSrcjiCM@capstone.gptiazz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

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
