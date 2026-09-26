import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "@clerk/react";

import {
    getMyTrips,
    removeMyTrip,
    clearMyTrips,
} from "../lib/api";


const Mytrip = () => {

    const navigate = useNavigate();

    const {
        isLoaded,
        isSignedIn,
        getToken,
    } = useAuth();


    /* =================================================
       STATE
    ================================================= */

    const [trips, setTrips] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);

    const [clearing, setClearing] =
        useState(false);


    /* =================================================
       LOAD TRIPS
    ================================================= */

    const loadTrips = useCallback(
        async () => {

            try {

                if (!isLoaded) {
                    return;
                }


                if (!isSignedIn) {

                    setTrips([]);

                    setLoading(false);

                    return;
                }


                setLoading(true);

                setError("");


                const token =
                    await getToken();


                if (!token) {

                    throw new Error(
                        "Authentication token is unavailable."
                    );

                }


                console.log(
                    "🔄 Loading My Trips..."
                );


                const result =
                    await getMyTrips(token);


                console.log(
                    "✅ My Trips response:",
                    result
                );


                /*
                 * Backend returns:
                 *
                 * {
                 *   success: true,
                 *   trips: [...]
                 * }
                 */

                const tripsData =
                    Array.isArray(result)
                        ? result
                        : result?.trips || [];


                setTrips(
                    tripsData
                );


            } catch (err) {

                console.error(
                    "❌ Failed to load My Trips:",
                    err
                );


                setError(
                    err?.message ||
                    "Unable to load your trips."
                );


            } finally {

                setLoading(false);

            }

        },
        [
            isLoaded,
            isSignedIn,
            getToken,
        ]
    );


    /* =================================================
       LOAD WHEN USER AUTH IS READY
    ================================================= */

    useEffect(() => {

        loadTrips();

    }, [loadTrips]);


    /* =================================================
       REMOVE ONE PLACE
    ================================================= */

    const handleRemove = async (
        trip
    ) => {

        try {

            const place =
                trip?.placeId;


            const placeId =
                typeof place === "string"
                    ? place
                    : place?._id;


            if (!placeId) {

                throw new Error(
                    "Place ID is missing."
                );

            }


            const confirmed =
                window.confirm(
                    `Remove ${
                        place?.name || "this place"
                    } from My Trips?`
                );


            if (!confirmed) {
                return;
            }


            setRemovingId(
                placeId
            );


            const token =
                await getToken();


            if (!token) {

                throw new Error(
                    "Authentication token is unavailable."
                );

            }


            await removeMyTrip(
                placeId,
                token
            );


            setTrips(
                currentTrips =>
                    currentTrips.filter(
                        item => {

                            const id =
                                typeof item.placeId === "string"
                                    ? item.placeId
                                    : item.placeId?._id;

                            return id !== placeId;

                        }
                    )
            );


            console.log(
                "✅ Trip removed."
            );


        } catch (err) {

            console.error(
                "❌ Failed to remove trip:",
                err
            );


            alert(
                err?.message ||
                "Unable to remove this trip."
            );


        } finally {

            setRemovingId(null);

        }

    };


    /* =================================================
       CLEAR ALL
    ================================================= */

    const handleClearAll = async () => {

        try {

            if (!trips.length) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to remove all saved trips?"
                );


            if (!confirmed) {
                return;
            }


            setClearing(true);


            const token =
                await getToken();


            if (!token) {

                throw new Error(
                    "Authentication token is unavailable."
                );

            }


            await clearMyTrips(
                token
            );


            setTrips([]);


            console.log(
                "✅ All trips cleared."
            );


        } catch (err) {

            console.error(
                "❌ Failed to clear trips:",
                err
            );


            alert(
                err?.message ||
                "Unable to clear your trips."
            );


        } finally {

            setClearing(false);

        }

    };


    /* =================================================
       OPEN DIRECTIONS
    ================================================= */

    const handleDirections = (
        trip
    ) => {

        const place =
            trip?.placeId;


        if (!place?._id) {

            alert(
                "Place information is unavailable."
            );

            return;
        }


        navigate(
            `/places/${place._id}/map`
        );

    };


    /* =================================================
       NOT SIGNED IN
    ================================================= */

    if (
        isLoaded &&
        !isSignedIn
    ) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

                <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                        🧳
                    </div>


                    <h1 className="text-2xl font-bold text-slate-900">
                        My Trips
                    </h1>


                    <p className="mt-3 text-slate-500">
                        Sign in to save and manage your
                        favorite Bharatpur destinations.
                    </p>


                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                    >
                        Go Home
                    </button>

                </div>

            </div>
        );

    }


    /* =================================================
       LOADING
    ================================================= */

    if (
        !isLoaded ||
        loading
    ) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />

                    <p className="mt-4 text-slate-500">
                        Loading your trips...
                    </p>

                </div>

            </div>
        );

    }


    /* =================================================
       PAGE
    ================================================= */

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =========================================
                HEADER
            ========================================= */}

            <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white">

                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">
                                Bharatpur AI
                            </p>


                            <h1 className="mt-2 text-4xl font-bold">
                                My Trips
                            </h1>


                            <p className="mt-2 max-w-xl text-orange-50">
                                Your saved destinations in
                                Bharatpur and Chitwan.
                            </p>

                        </div>


                        {trips.length > 0 && (

                            <button
                                onClick={handleClearAll}
                                disabled={clearing}
                                className="rounded-xl bg-white/15 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {clearing
                                    ? "Clearing..."
                                    : "Clear All"}
                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* =========================================
                CONTENT
            ========================================= */}

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">


                {/* ERROR */}

                {error && (

                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

                        <p className="font-semibold">
                            Unable to load trips
                        </p>

                        <p className="mt-1 text-sm">
                            {error}
                        </p>


                        <button
                            onClick={loadTrips}
                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =====================================
                    EMPTY STATE
                ===================================== */}

                {!error &&
                    trips.length === 0 && (

                        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
                                🗺️
                            </div>


                            <h2 className="mt-6 text-2xl font-bold text-slate-900">
                                No saved trips yet
                            </h2>


                            <p className="mx-auto mt-3 max-w-md text-slate-500">
                                Explore Bharatpur and save
                                the places you want to visit.
                            </p>


                            <button
                                onClick={() =>
                                    navigate("/explore")
                                }
                                className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                            >
                                Explore Places
                            </button>

                        </div>

                    )}


                {/* =====================================
                    TRIP GRID
                ===================================== */}

                {trips.length > 0 && (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {trips.map(
                            (
                                trip
                            ) => {

                                const place =
                                    trip?.placeId;


                                if (!place) {
                                    return null;
                                }


                                return (

                                    <article
                                        key={trip._id}
                                        className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        {/* IMAGE */}

                                        <div className="relative h-56 overflow-hidden bg-slate-200">

                                            {place.image ? (

                                                <img
                                                    src={place.image}
                                                    alt={place.name}
                                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                                />

                                            ) : (

                                                <div className="flex h-full items-center justify-center text-5xl">
                                                    📍
                                                </div>

                                            )}


                                            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-600 shadow">
                                                Saved
                                            </div>

                                        </div>


                                        {/* CONTENT */}

                                        <div className="p-5">

                                            <div className="flex items-start justify-between gap-3">

                                                <h2 className="text-xl font-bold text-slate-900">
                                                    {place.name}
                                                </h2>


                                                {place.rating > 0 && (

                                                    <span className="shrink-0 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
                                                        ★ {place.rating}
                                                    </span>

                                                )}

                                            </div>


                                            {place.location && (

                                                <p className="mt-2 text-sm text-slate-500">
                                                    📍 {place.location}
                                                </p>

                                            )}


                                            {place.description && (

                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                                    {place.description}
                                                </p>

                                            )}


                                            {/* ACTIONS */}

                                            <div className="mt-5 grid grid-cols-2 gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleDirections(
                                                            trip
                                                        )
                                                    }
                                                    className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                                                >
                                                    Directions
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleRemove(
                                                            trip
                                                        )
                                                    }
                                                    disabled={
                                                        removingId ===
                                                        place._id
                                                    }
                                                    className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {removingId ===
                                                    place._id
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </main>

        </div>
    );

};


export default Mytrip;