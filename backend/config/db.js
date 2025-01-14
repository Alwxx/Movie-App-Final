const mongoose = require("mongoose");
const Favorite = require("../src/models/Favorite");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");

    // const cleanupOrphanedFavorites = async () => {
    //   try {
    //     console.log("Starting cleanup process...");
    //     const orphanedFavorites = await Favorite.aggregate([
    //       {
    //         $lookup: {
    //           from: "movies", // Collection name for Movie
    //           localField: "movie",
    //           foreignField: "_id",
    //           as: "movieDetails",
    //         },
    //       },
    //       {
    //         $match: {
    //           movieDetails: { $size: 0 }, // No matching movie found
    //         },
    //       },
    //     ]);

    //     const orphanedIds = orphanedFavorites.map((fav) => fav._id);

    //     if (orphanedIds.length > 0) {
    //       await Favorite.deleteMany({ _id: { $in: orphanedIds } });
    //       console.log(`Deleted ${orphanedIds.length} orphaned favorites.`);
    //     } else {
    //       console.log("No orphaned favorites found.");
    //     }
    //   } catch (error) {
    //     console.error("Error during cleanup:", error);
    //   }
    // };

    // cleanupOrphanedFavorites();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
