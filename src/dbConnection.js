const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(process.env.DB_NAME);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
