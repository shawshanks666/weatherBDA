// const express = require('express');
// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const uri = process.env.MONGO_URI;
// const app = express();
// const port = 3000;

// // Serve static files from the "src" directory
// app.use(express.static('src'));

// const runAggregation = async () => {
//     const client = new MongoClient(uri);
//     let monthlyResult = [];
//     let yearlyResult = [];

//     try {
//         await client.connect();
//         const database = client.db('weather_db');  // Specify your database here
//         const collection = database.collection('london_weather');  // Specify your collection

//         // Updated monthly aggregation pipeline
//         const monthlyPipeline = [
//             {
//                 $group: {
//                     _id: {
//                         year: { $year: "$date" },
//                         month: { $month: "$date" }
//                     },
//                     avgCloudCover: { $avg: "$cloud_cover" },
//                     avgPressure: { $avg: "$pressure" },
//                     avgMaxTemperature: { $avg: "$max_temp" },
//                     avgMinTemperature: { $avg: "$min_temp" }
//                 }
//             },
//             {
//                 $sort: { "_id.year": 1, "_id.month": 1 }
//             }
//         ];

//         // Run monthly aggregation
//         monthlyResult = await collection.aggregate(monthlyPipeline).toArray();

//         // Updated yearly aggregation pipeline
//         const yearlyPipeline = [
//             {
//                 $group: {
//                     _id: { year: { $year: "$date" } },
//                     avgCloudCover: { $avg: "$cloud_cover" },
//                     avgPressure: { $avg: "$pressure" },
//                     avgMaxTemperature: { $avg: "$max_temp" },
//                     avgMinTemperature: { $avg: "$min_temp" }
//                 }
//             },
//             {
//                 $sort: { "_id.year": 1 }
//             }
//         ];

//         // Run yearly aggregation
//         yearlyResult = await collection.aggregate(yearlyPipeline).toArray();

//     } catch (error) {
//         console.error('Error running aggregation:', error);
//     } finally {
//         await client.close();
//     }

//     return { monthlyResult, yearlyResult };
// };

// app.get('/data', async (req, res) => {
//     const { monthlyResult, yearlyResult } = await runAggregation();

//     // Extract data for visualization
//     const monthlyTemperatures = monthlyResult.map(item => item.avgMaxTemperature);
//     const monthlyCloudCover = monthlyResult.map(item => item.avgCloudCover);
//     const monthlyPressure = monthlyResult.map(item => item.avgPressure);
//     const years = yearlyResult.map(item => item._id.year);
//     const yearlyTemperatures = yearlyResult.map(item => item.avgMaxTemperature);

//     // Send data to the client
//     res.json({ monthlyTemperatures, monthlyCloudCover, monthlyPressure, years, yearlyTemperatures });
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });








// const express = require('express');
// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const uri = process.env.MONGO_URI;
// const app = express();
// const port = 3000;

// // Serve static files from the "src" directory
// app.use(express.static('src'));

// // Function to run the aggregation
// const runAggregation = async () => {
//   const client = new MongoClient(uri);
//   let monthlyData = [];

//   try {
//     await client.connect();
//     const database = client.db('weather_db'); // Specify your database here
//     const collection = database.collection('london_weather'); // Specify your collection

//     // Monthly data pipeline
//     const monthlyPipeline = [
//       {
//         $group: {
//           _id: {
//             year: { $year: "$date" },  // Extract the year from the date
//             month: { $month: "$date" } // Extract the month from the date
//           },
//           avgTemperature: { $avg: "$mean_temp" }, // Average temperature for the month
//           totalPrecipitation: { $sum: "$precipitation" }, // Total precipitation for the month
//           avgCloudCover: { $avg: "$cloud_cover" }, // Average cloud cover for the month
//           avgPressure: { $avg: "$pressure" } // Average pressure for the month
//         }
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 } // Sort the results by year and month
//       }
//     ];

//     // Run the aggregation
//     monthlyData = await collection.aggregate(monthlyPipeline).toArray();

//   } catch (error) {
//     console.error('Error running aggregation:', error);
//   } finally {
//     await client.close();
//   }

//   return monthlyData;
// };

// // Endpoint to get monthly data
// app.get('/monthly-data', async (req, res) => {
//   const monthlyData = await runAggregation();

//   // Format the data for visualization
//   const labels = monthlyData.map(item => `${item._id.year}-${item._id.month < 10 ? '0' : ''}${item._id.month}`);
//   const temperatures = monthlyData.map(item => item.avgTemperature);
//   const precipitation = monthlyData.map(item => item.totalPrecipitation);
//   const cloudCover = monthlyData.map(item => item.avgCloudCover);
//   const pressure = monthlyData.map(item => item.avgPressure);

//   res.json({ labels, temperatures, precipitation, cloudCover, pressure });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI; // Make sure this is correct
const app = express();
const port = 3000;

// Serve static files from the "src" directory
app.use(express.static('src'));

const runAggregation = async () => {
    const client = new MongoClient(uri);
    let result = {};

    try {
        await client.connect();
        const database = client.db('weather_db');  // Ensure your database name is correct
        const collection = database.collection('london_weather');  // Ensure your collection name is correct

        // Aggregation pipeline for monthly temperature and precipitation
        const pipeline = [
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },  // Extract the year from the date
                        month: { $month: "$date" } // Extract the month from the date
                    },
                    avgTemperature: { $avg: "$mean_temp" }, // Average temperature for the month
                    totalPrecipitation: { $sum: "$precipitation" }  // Total precipitation for the month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort the results by year and month
            }
        ];

        // Run aggregation
        const aggregatedData = await collection.aggregate(pipeline).toArray();

        // Structure data for easier access
        aggregatedData.forEach(item => {
            const year = item._id.year;
            const month = item._id.month;

            if (!result[year]) {
                result[year] = [];
            }

            result[year][month - 1] = {
                avgTemperature: item.avgTemperature,
                totalPrecipitation: item.totalPrecipitation
            };
        });

    } catch (error) {
        console.error('Error running aggregation:', error);
    } finally {
        await client.close();
    }

    return result;
};

// Create the /data endpoint
app.get('/data', async (req, res) => {
    const result = await runAggregation();
    res.json(result);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

