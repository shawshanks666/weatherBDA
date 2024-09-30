const fs = require('fs');
const csv = require('csv-parser');
const connectDB = require('./dbConnection');
const { log } = require('console');

const importData = async () => {
  const db = await connectDB();
  const collection = db.collection('london_weather');
  const data = [];

  fs.createReadStream('./data/london_weather.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Convert yyyyMMdd string to Date object
      const year = parseInt(row.date.substring(0, 4));
      const month = parseInt(row.date.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(row.date.substring(6, 8));
      const convertedDate = new Date(year, month, day);
      console.log(convertedDate);
      data.push({
        date: convertedDate,  // Use the converted Date object
        cloud_cover: parseFloat(row.cloud_cover),
        sunshine: parseFloat(row.sunshine),
        global_radiation: parseFloat(row.global_radiation),
        max_temp: parseFloat(row.max_temp),
        mean_temp: parseFloat(row.mean_temp),
        min_temp: parseFloat(row.min_temp),
        precipitation: parseFloat(row.precipitation),
        pressure: parseFloat(row.pressure),
        snow_depth: parseFloat(row.snow_depth),
      });
    })
    .on('end', async () => {
      // Optionally delete old data if needed
      // await collection.deleteMany({}); 

      await collection.insertMany(data);
      console.log('Data successfully imported');
      process.exit();
    });
};

importData();

