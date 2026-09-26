import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env.js";

import placesRoutes from "./routes/places.routes.js";
import tripsRoutes from "./routes/trips.routes.js";

import { apiLimiter } from "./middleware/rateLimit.js";

import {
    notFound,
    errorHandler
} from "./middleware/error.js";


const app = express();


app.disable("x-powered-by");


app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ],

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);


app.use(compression());


app.use(
    express.json({
        limit: "100kb"
    })
);


app.use(
    express.urlencoded({
        extended: false,
        limit: "50kb"
    })
);


app.use(pinoHttp());


app.use(clerkMiddleware());


app.use("/api", apiLimiter);


/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
    "/health",
    (req, res) => {

        res.json({
            success: true,
            service: "bharatpur-ai-api",
            timestamp: new Date().toISOString()
        });

    }
);


/* =====================================================
   ROUTES
===================================================== */

app.use(
    "/api/places",
    placesRoutes
);


app.use(
    "/api/trips",
    tripsRoutes
);


/* =====================================================
   ERROR HANDLING
===================================================== */

app.use(notFound);

app.use(errorHandler);


/* =====================================================
   EXPORT APP
===================================================== */

export default app;