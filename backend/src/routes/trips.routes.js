// import express from "express";

// import Trip from "../models/Trip.js";

// import { requireAuth } from "../middleware/auth.js";

// const router =
//     express.Router();

// /* =========================================================
//    GET MY TRIPS
// ========================================================= */

// router.get(
//     "/",
//     requireAuth,
//     async (req, res, next) => {
//         try {
//             const trips =
//                 await Trip.find({
//                     userId:
//                         req.userId,
//                 })
//                     .populate("placeId")
//                     .sort({
//                         createdAt: -1,
//                     })
//                     .lean();

//             res.json({
//                 success: true,
//                 trips,
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );

// /* =========================================================
//    ADD TRIP
// ========================================================= */

// router.post(
//     "/",
//     requireAuth,
//     async (req, res, next) => {
//         try {
//             const {
//                 placeId,
//             } = req.body;

//             if (!placeId) {
//                 return res.status(400).json({
//                     success: false,
//                     error: "placeId is required.",
//                 });
//             }

//             const existing =
//                 await Trip.findOne({
//                     userId:
//                         req.userId,

//                     placeId,
//                 });

//             if (existing) {
//                 return res.json({
//                     success: true,
//                     trip: existing,
//                     alreadyExists: true,
//                 });
//             }

//             const trip =
//                 await Trip.create({
//                     userId:
//                         req.userId,

//                     placeId,
//                 });

//             res.status(201).json({
//                 success: true,
//                 trip,
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );

// /* =========================================================
//    DELETE TRIP
// ========================================================= */

// router.delete(
//     "/:id",
//     requireAuth,
//     async (req, res, next) => {
//         try {
//             await Trip.deleteOne({
//                 _id: req.params.id,

//                 userId:
//                     req.userId,
//             });

//             res.json({
//                 success: true,
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );

// export default router;


// import express from "express";

// import Trip from "../models/Trip.js";
// import Place from "../models/Place.js";

// import { requireAuth } from "../middleware/auth.js";

// const router = express.Router();

// /* =========================================================
//    GET MY TRIPS
// ========================================================= */

// router.get(
//     "/",
//     requireAuth,
//     async (req, res, next) => {
//         try {
//             const trips = await Trip.find({
//                 userId: req.userId,
//             })
//                 .populate("placeId")
//                 .sort({
//                     createdAt: -1,
//                 })
//                 .lean();

//             res.json({
//                 success: true,
//                 trips,
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );


// /* =========================================================
//    ADD PLACE TO MY TRIPS
// ========================================================= */

// router.post(
//     "/",
//     requireAuth,
//     async (req, res, next) => {
//         try {
//             const {
//                 placeId,
//             } = req.body;

//             /* ---------------------------------------------
//                VALIDATE
//             --------------------------------------------- */

//             if (!placeId) {
//                 return res.status(400).json({
//                     success: false,
//                     error: "placeId is required.",
//                 });
//             }


//             /* ---------------------------------------------
//                CHECK PLACE EXISTS
//             --------------------------------------------- */

//             const place =
//                 await Place.findById(
//                     placeId
//                 );

//             if (!place) {
//                 return res.status(404).json({
//                     success: false,
//                     error: "Place not found.",
//                 });
//             }


//             /* ---------------------------------------------
//                CHECK EXISTING TRIP
//             --------------------------------------------- */

//             const existing =
//                 await Trip.findOne({
//                     userId:
//                         req.userId,

//                     placeId:
//                         place._id,
//                 });


//             if (existing) {
//                 const populatedTrip =
//                     await existing.populate(
//                         "placeId"
//                     );

//                 return res.json({
//                     success: true,

//                     trip:
//                         populatedTrip,

//                     alreadyExists: true,
//                 });
//             }


//             /* ---------------------------------------------
//                CREATE TRIP
//             --------------------------------------------- */

//             const trip =
//                 await Trip.create({
//                     userId:
//                         req.userId,

//                     placeId:
//                         place._id,

//                     status:
//                         "planned",
//                 });


//             /* ---------------------------------------------
//                POPULATE PLACE
//             --------------------------------------------- */

//             const populatedTrip =
//                 await trip.populate(
//                     "placeId"
//                 );


//             res.status(201).json({
//                 success: true,

//                 trip:
//                     populatedTrip,

//                 alreadyExists: false,
//             });

//         } catch (error) {

//             /*
//              * Handle MongoDB duplicate key
//              * in case two requests arrive
//              * at almost the same time.
//              */

//             if (
//                 error?.code === 11000
//             ) {
//                 const existing =
//                     await Trip.findOne({
//                         userId:
//                             req.userId,

//                         placeId:
//                             req.body.placeId,
//                     }).populate(
//                         "placeId"
//                     );

//                 return res.json({
//                     success: true,
//                     trip: existing,
//                     alreadyExists: true,
//                 });
//             }

//             next(error);
//         }
//     }
// );


// /* =========================================================
//    DELETE MY TRIP
// ========================================================= */

// router.delete(
//     "/:id",
//     requireAuth,
//     async (req, res, next) => {
//         try {

//             const deleted =
//                 await Trip.findOneAndDelete({
//                     _id:
//                         req.params.id,

//                     userId:
//                         req.userId,
//                 });


//             if (!deleted) {
//                 return res.status(404).json({
//                     success: false,
//                     error:
//                         "Trip not found.",
//                 });
//             }


//             res.json({
//                 success: true,
//                 message:
//                     "Trip removed successfully.",
//             });

//         } catch (error) {
//             next(error);
//         }
//     }
// );


// /* =========================================================
//    CLEAR ALL MY TRIPS
// ========================================================= */

// router.delete(
//     "/",
//     requireAuth,
//     async (req, res, next) => {
//         try {

//             const result =
//                 await Trip.deleteMany({
//                     userId:
//                         req.userId,
//                 });


//             res.json({
//                 success: true,

//                 deletedCount:
//                     result.deletedCount,
//             });

//         } catch (error) {
//             next(error);
//         }
//     }
// );


// export default router;


import express from "express";
import mongoose from "mongoose";

import Trip from "../models/Trip.js";
import Place from "../models/Place.js";

const router = express.Router();


/* =====================================================
   GET MY TRIPS
   GET /api/trips
===================================================== */

router.get("/", async (req, res, next) => {

    try {

        const { userId } = req.auth();

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });

        }


        const trips = await Trip.find({
            userId,
        })
            .populate({
                path: "placeId",
                model: Place,
            })
            .sort({
                createdAt: -1,
            });


        return res.status(200).json({
            success: true,
            count: trips.length,
            trips,
        });

    } catch (error) {

        next(error);

    }

});


/* =====================================================
   ADD PLACE TO MY TRIPS
   POST /api/trips

   Body:
   {
       "placeId": "MongoDB ObjectId"
   }
===================================================== */

router.post("/", async (req, res, next) => {

    try {

        const { userId } = req.auth();

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });

        }


        const { placeId } = req.body;


        if (!placeId) {

            return res.status(400).json({
                success: false,
                message: "placeId is required.",
            });

        }


        if (!mongoose.Types.ObjectId.isValid(placeId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid placeId.",
            });

        }


        /* ---------------------------------------------
           Check place
        --------------------------------------------- */

        const place = await Place.findById(placeId);


        if (!place) {

            return res.status(404).json({
                success: false,
                message: "Place not found.",
            });

        }


        /* ---------------------------------------------
           Check existing trip
        --------------------------------------------- */

        const existingTrip = await Trip.findOne({
            userId,
            placeId,
        }).populate("placeId");


        if (existingTrip) {

            return res.status(200).json({
                success: true,
                alreadyExists: true,
                message: "Place is already in My Trips.",
                trip: existingTrip,
            });

        }


        /* ---------------------------------------------
           Create trip
        --------------------------------------------- */

        const trip = await Trip.create({
            userId,
            placeId,
        });


        const populatedTrip = await Trip.findById(
            trip._id
        ).populate("placeId");


        return res.status(201).json({
            success: true,
            alreadyExists: false,
            message: "Place added to My Trips.",
            trip: populatedTrip,
        });

    } catch (error) {

        /*
         * Handles duplicate-key race condition.
         */

        if (error?.code === 11000) {

            const { userId } = req.auth();

            const existingTrip = await Trip.findOne({
                userId,
                placeId: req.body.placeId,
            }).populate("placeId");


            return res.status(200).json({
                success: true,
                alreadyExists: true,
                message: "Place is already in My Trips.",
                trip: existingTrip,
            });

        }


        next(error);

    }

});


/* =====================================================
   REMOVE ONE TRIP
   DELETE /api/trips/:placeId
===================================================== */

router.delete("/:placeId", async (req, res, next) => {

    try {

        const { userId } = req.auth();

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });

        }


        const { placeId } = req.params;


        if (!mongoose.Types.ObjectId.isValid(placeId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid placeId.",
            });

        }


        const deletedTrip = await Trip.findOneAndDelete({
            userId,
            placeId,
        });


        if (!deletedTrip) {

            return res.status(404).json({
                success: false,
                message: "Trip not found.",
            });

        }


        return res.status(200).json({
            success: true,
            message: "Place removed from My Trips.",
        });

    } catch (error) {

        next(error);

    }

});


/* =====================================================
   CLEAR ALL MY TRIPS
   DELETE /api/trips
===================================================== */

router.delete("/", async (req, res, next) => {

    try {

        const { userId } = req.auth();

        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });

        }


        const result = await Trip.deleteMany({
            userId,
        });


        return res.status(200).json({
            success: true,
            message: "All trips cleared.",
            deletedCount: result.deletedCount,
        });

    } catch (error) {

        next(error);

    }

});


export default router;