const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function runAggregation() {
  const client = new MongoClient(uri);
  const deleteNullEntries = async () => {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('weather_db'); // Specify your database here
      const collection = database.collection('london_weather'); // Specify your collection here
  
      // Delete documents where any of these fields are null
      const result = await collection.deleteMany({
        $or: [
          { mean_temp: null },
          { max_temp: null },
          { min_temp: null },
          { cloud_cover: null },
          { sunshine: null },
          { global_radiation: null },
          { precipitation: null },
          { pressure: null },
          { snow_depth: null }
        ]
      });
  
      console.log(`${result.deletedCount} documents were deleted`);
    } catch (error) {
      console.error('Error deleting documents:', error);
    } finally {
      await client.close();
    }
  };
  
  deleteNullEntries();
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const database = client.db('weather_db');  // Specify your database here
//     const collection = database.collection('london_weather');  // Specify your collection

//     // Your aggregation pipeline
//     const pipeline = [
//         {
//           $group: {
//             _id: {
//               year: { $year: "$date" },  // Extract the year from the date
//               month: { $month: "$date" } // Extract the month from the date
//             },
//             avgTemperature: { $avg: "$mean_temp" }, // Average temperature for the month (use mean_temp)
//             maxTemperature: { $max: "$max_temp" },   // Maximum temperature for the month
//             minTemperature: { $min: "$min_temp" }    // Minimum temperature for the month
//           }
//         },
//         {
//           $sort: { "_id.year": 1, "_id.month": 1 } // Sort the results by year and month
//         }
//       ];
      
//       const yearlyPipeline = [
//         {
//           $group: {
//             _id: { year: { $year: "$date" } }, // Group by year
//             avgTemperature: { $avg: "$mean_temp" }, // Average temperature for the year
//             maxTemperature: { $max: "$max_temp" },   // Maximum temperature for the year
//             minTemperature: { $min: "$min_temp" }    // Minimum temperature for the year
//           }
//         },
//         {
//           $sort: { "_id.year": 1 } // Sort the results by year
//         }
//       ];
      
//       // Run yearly aggregation
//       const yearlyResult = await collection.aggregate(yearlyPipeline).toArray();
      
//       console.log('Yearly Aggregation Results:', yearlyResult);
      
//     // Run aggregation
//     const monthlyResult = await collection.aggregate(pipeline).toArray();
//     console.log('Aggregation Results:', result);
//     const monthlyTemperatures = monthlyResult.map(item => item.avgTemperature);
//     const years = yearlyResult.map(item => item._id.year);
//     const yearlyTemperatures = yearlyResult.map(item => item.avgTemperature);

//   } catch (error) {
//     console.error('Error running aggregation:', error);
//   } finally {
//     await client.close();
//   }
}

runAggregation();
