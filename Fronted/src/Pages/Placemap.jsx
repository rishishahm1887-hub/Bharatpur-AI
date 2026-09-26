import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
// import { useParams } from "react-router-dom";
import { useSearchParams, useParams } from "react-router-dom";

import useNavigation from "../hooks/useNavigation";

/*
|--------------------------------------------------------------------------
| Google libraries
|--------------------------------------------------------------------------
|
| routes -> Route.computeRoutes()
| places -> Place({ id: googlePlaceId })
|
*/

const GOOGLE_MAPS_LIBRARIES = [
  "routes",
  "places",
];

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "calc(100vh - 72px)",
};

const DEFAULT_CENTER = {
  lat: 27.5291,
  lng: 84.3542,
};

/*
|--------------------------------------------------------------------------
| Coordinate validation
|--------------------------------------------------------------------------
*/

function isValidCoordinate(
  lat,
  lng
) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/*
|--------------------------------------------------------------------------
| Format distance
|--------------------------------------------------------------------------
*/

function formatDistance(
  meters
) {
  if (
    !Number.isFinite(
      Number(meters)
    )
  ) {
    return "--";
  }

  const value =
    Number(meters);

  if (value < 1000) {
    return `${Math.round(
      value
    )} m`;
  }

  return `${(
    value / 1000
  ).toFixed(1)} km`;
}

/*
|--------------------------------------------------------------------------
| Format duration
|--------------------------------------------------------------------------
*/

function formatDuration(
  milliseconds
) {
  if (
    !Number.isFinite(
      Number(milliseconds)
    )
  ) {
    return "--";
  }

  const totalMinutes =
    Math.round(
      Number(milliseconds) /
      60000
    );

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

export default function Placemap({
  apiUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api",
}) {
  // const { id: routePlaceId } = useParams();

  // const placeId = routePlaceId;

  const [searchParams] = useSearchParams();
  const { id: routePlaceId } = useParams();

  const placeId =
    routePlaceId ||
    searchParams.get("id");


  /*
   * ---------------------------------------------------------------
   * Google Maps
   * ---------------------------------------------------------------
   */

  const {
    isLoaded,
    loadError,
  } = useJsApiLoader({
    id: "bharatpur-ai-google-map",

    googleMapsApiKey:
      import.meta.env
        .VITE_GOOGLE_MAPS_API_KEY,

    libraries:
      GOOGLE_MAPS_LIBRARIES,
  });

  /*
   * ---------------------------------------------------------------
   * Place
   * ---------------------------------------------------------------
   */

  const [place, setPlace] =
    useState(null);

  const [placeLoading, setPlaceLoading] =
    useState(true);

  const [placeError, setPlaceError] =
    useState("");

  const [
    showDestinationInfo,
    setShowDestinationInfo,
  ] = useState(true);

  /*
   * ---------------------------------------------------------------
   * Load place from backend
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadPlace() {
      if (!placeId) {
        setPlaceError(
          "Place ID is missing."
        );

        setPlaceLoading(false);

        return;
      }

      try {
        setPlaceLoading(true);

        setPlaceError("");

        const response =
          await fetch(
            `${apiUrl}/places/${placeId}`
          );

        const data =
          await response
            .json()
            .catch(
              () => ({})
            );

        if (
          !response.ok
        ) {
          throw new Error(
            data?.error ||
            "Failed to load place."
          );
        }

        if (
          !data?.place
        ) {
          throw new Error(
            "Place data is missing."
          );
        }

        if (!cancelled) {
          setPlace(
            data.place
          );
        }
      } catch (error) {
        console.error(
          "❌ PLACE LOAD ERROR:",
          error
        );

        if (!cancelled) {
          setPlaceError(
            error?.message ||
            "Failed to load place."
          );
        }
      } finally {
        if (!cancelled) {
          setPlaceLoading(false);
        }
      }
    }

    loadPlace();

    return () => {
      cancelled = true;
    };
  }, [
    placeId,
    apiUrl,
  ]);

  /*
   * ---------------------------------------------------------------
   * Destination
   * ---------------------------------------------------------------
   *
   * We retain lat/lng for the marker.
   *
   * But navigation requires:
   *
   * place.googlePlaceId
   *
   * ---------------------------------------------------------------
   */

  const destination =
    useMemo(() => {
      if (!place) {
        return null;
      }

      const googlePlaceId =
        String(
          place.googlePlaceId ||
          ""
        ).trim();

      /*
       * Google Place ID is mandatory.
       */

      if (!googlePlaceId) {
        console.error(
          "❌ PLACE DOES NOT HAVE GOOGLE PLACE ID:",
          place
        );

        return null;
      }

      let latitude =
        Number(
          place.latitude
        );

      let longitude =
        Number(
          place.longitude
        );

      /*
       * GeoJSON fallback.
       *
       * MongoDB stores:
       *
       * [longitude, latitude]
       */

      if (
        !isValidCoordinate(
          latitude,
          longitude
        )
      ) {
        const coordinates =
          place.locationPoint
            ?.coordinates;

        if (
          Array.isArray(
            coordinates
          ) &&
          coordinates.length >= 2
        ) {
          longitude =
            Number(
              coordinates[0]
            );

          latitude =
            Number(
              coordinates[1]
            );
        }
      }

      /*
       * lat/lng fallback.
       */

      if (
        !isValidCoordinate(
          latitude,
          longitude
        )
      ) {
        latitude =
          Number(
            place.lat
          );

        longitude =
          Number(
            place.lng
          );
      }

      /*
       * Final validation.
       */

      if (
        !isValidCoordinate(
          latitude,
          longitude
        )
      ) {
        console.error(
          "❌ INVALID DESTINATION COORDINATES:",
          {
            place,
            latitude,
            longitude,
          }
        );

        return null;
      }

      const result = {
        lat: latitude,

        lng: longitude,

        googlePlaceId,
      };

      console.log(
        "🎯 GOOGLE DESTINATION:",
        result
      );

      return result;
    }, [place]);

  /*
   * ---------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------
   */

  const {
    isNavigating,

    position,

    route,

    routes,

    selectedRoute,

    loadingRoute,

    error,

    offRoute,

    speed,

    distanceToDestination,

    eta,

    startNavigation,

    stopNavigation,

    recalculateRoute,

    selectRoute,
  } = useNavigation({
    destination,

    mode: "driving",

    googleLoaded: isLoaded,
  });

  /*
   * ---------------------------------------------------------------
   * Map center
   * ---------------------------------------------------------------
   */

  const mapCenter =
    position
      ? {
        lat: position.lat,

        lng: position.lng,
      }
      : destination
        ? {
          lat:
            destination.lat,

          lng:
            destination.lng,
        }
        : DEFAULT_CENTER;

  /*
   * ---------------------------------------------------------------
   * Map reference
   * ---------------------------------------------------------------
   */

  const [
    map,
    setMap,
  ] = useState(null);

  const onMapLoad =
    useCallback(
      (mapInstance) => {
        setMap(
          mapInstance
        );
      },
      []
    );

  const onMapUnmount =
    useCallback(() => {
      setMap(null);
    }, []);

  /*
   * ---------------------------------------------------------------
   * Fit route
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    if (
      !map ||
      !route?.path ||
      route.path.length === 0
    ) {
      return;
    }

    if (
      !window.google?.maps
    ) {
      return;
    }

    const bounds =
      new window.google.maps.LatLngBounds();

    route.path.forEach(
      (point) => {
        bounds.extend({
          lat: point.lat,

          lng: point.lng,
        });
      }
    );

    /*
     * Include current GPS position.
     */

    if (position) {
      bounds.extend({
        lat: position.lat,

        lng: position.lng,
      });
    }

    /*
     * Include destination.
     */

    if (destination) {
      bounds.extend({
        lat:
          destination.lat,

        lng:
          destination.lng,
      });
    }

    map.fitBounds(
      bounds,
      80
    );
  }, [
    map,
    route,
    position,
    destination,
  ]);

  /*
   * ---------------------------------------------------------------
   * Loading
   * ---------------------------------------------------------------
   */

  if (placeLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-5 py-4 shadow">
          Loading place...
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * Google load error
   * ---------------------------------------------------------------
   */

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-5 shadow">
          <h2 className="font-semibold text-red-600">
            Google Maps failed to load
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Check your Google Maps API key,
            Maps JavaScript API,
            Places API and Routes API.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * Place error
   * ---------------------------------------------------------------
   */

  if (placeError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-5 shadow">
          <h2 className="font-semibold text-red-600">
            Unable to load place
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {placeError}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * Missing Google Place ID
   * ---------------------------------------------------------------
   */

  if (
    place &&
    !place.googlePlaceId
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-amber-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-amber-700">
            Google Place ID missing
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            This destination has not been
            resolved with Google Places yet.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Place: {place.name}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * Missing destination
   * ---------------------------------------------------------------
   */

  if (!destination) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-6">
        <div className="rounded-xl bg-white p-5 shadow">
          Invalid destination.
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * Main UI
   * ---------------------------------------------------------------
   */

  return (
    <div className="relative h-[calc(100vh-72px)] w-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={
          MAP_CONTAINER_STYLE
        }
        center={mapCenter}
        zoom={14}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{
          streetViewControl: false,

          mapTypeControl: false,

          fullscreenControl: true,

          clickableIcons: true,

          gestureHandling: "greedy",
        }}
      >
        {/*
         * ----------------------------------------------------------
         * DESTINATION MARKER
         * ----------------------------------------------------------
         */}

        <Marker
          position={{
            lat:
              destination.lat,

            lng:
              destination.lng,
          }}
          title={
            place?.name ||
            "Destination"
          }
          onClick={() =>
            setShowDestinationInfo(
              true
            )
          }
        />

        {/*
         * ----------------------------------------------------------
         * DESTINATION INFO
         * ----------------------------------------------------------
         */}

        {showDestinationInfo && (
          <InfoWindow
            position={{
              lat:
                destination.lat,

              lng:
                destination.lng,
            }}
            onCloseClick={() =>
              setShowDestinationInfo(
                false
              )
            }
          >
            <div className="min-w-[180px]">
              <h3 className="font-semibold text-slate-900">
                {place?.name ||
                  "Destination"}
              </h3>

              {place?.formattedAddress && (
                <p className="mt-1 text-xs text-slate-500">
                  {
                    place.formattedAddress
                  }
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {/*
         * ----------------------------------------------------------
         * USER GPS MARKER
         * ----------------------------------------------------------
         */}

        {position && (
          <Marker
            position={{
              lat:
                position.lat,

              lng:
                position.lng,
            }}
            title="Your location"
            icon={{
              path:
                window.google?.maps
                  ?.SymbolPath
                  ?.CIRCLE,

              scale: 8,

              fillColor:
                "#2563eb",

              fillOpacity: 1,

              strokeColor:
                "#ffffff",

              strokeWeight: 3,
            }}
          />
        )}

        {/*
         * ----------------------------------------------------------
         * ROUTE
         * ----------------------------------------------------------
         */}

        {route?.path?.length > 1 && (
          <Polyline
            path={route.path}
            options={{
              strokeColor:
                "#2563eb",

              strokeOpacity: 0.9,

              strokeWeight: 6,

              geodesic: true,

              zIndex: 10,
            }}
          />
        )}
      </GoogleMap>

      {/*
       * ------------------------------------------------------------
       * TOP INFORMATION
       * ------------------------------------------------------------
       */}

      <div className="absolute left-4 right-4 top-4 z-20">
        <div className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {place?.name ||
                  "Destination"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Google Place ID navigation
              </p>
            </div>

            {isNavigating && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Navigating
              </span>
            )}
          </div>

          {/*
           * Navigation statistics
           */}

          {isNavigating && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[10px] text-slate-500">
                  Distance
                </p>

                <p className="font-semibold text-slate-900">
                  {formatDistance(
                    distanceToDestination
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[10px] text-slate-500">
                  Speed
                </p>

                <p className="font-semibold text-slate-900">
                  {Number.isFinite(
                    speed
                  )
                    ? `${speed.toFixed(
                      0
                    )} km/h`
                    : "--"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[10px] text-slate-500">
                  ETA
                </p>

                <p className="font-semibold text-slate-900">
                  {eta !== null
                    ? `${eta} min`
                    : "--"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*
       * ------------------------------------------------------------
       * OFF ROUTE
       * ------------------------------------------------------------
       */}

      {offRoute && (
        <div className="absolute left-4 right-4 top-36 z-20">
          <div className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            You are off route. Recalculating...
          </div>
        </div>
      )}

      {/*
       * ------------------------------------------------------------
       * ERROR
       * ------------------------------------------------------------
       */}

      {error && (
        <div className="absolute bottom-28 left-4 right-4 z-20">
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/*
       * ------------------------------------------------------------
       * BOTTOM CONTROLS
       * ------------------------------------------------------------
       */}

      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
          {!isNavigating ? (
            <button
              type="button"
              onClick={
                startNavigation
              }
              disabled={
                loadingRoute
              }
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingRoute
                ? "Calculating route..."
                : "Start Navigation"}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={
                  recalculateRoute
                }
                disabled={
                  loadingRoute
                }
                className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loadingRoute
                  ? "Loading..."
                  : "Recalculate"}
              </button>

              <button
                type="button"
                onClick={
                  stopNavigation
                }
                className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
              >
                Stop Navigation
              </button>
            </div>
          )}

          {/*
           * Alternative routes
           */}

          {routes.length > 1 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">
                Alternative routes
              </p>

              <div className="flex gap-2 overflow-x-auto">
                {routes.map(
                  (
                    routeItem,
                    index
                  ) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        selectRoute(
                          index
                        )
                      }
                      className={`min-w-[120px] rounded-xl border px-3 py-2 text-left ${selectedRoute ===
                        index
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white"
                        }`}
                    >
                      <p className="text-xs font-semibold">
                        Route{" "}
                        {index + 1}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDistance(
                          routeItem.distanceMeters
                        )}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatDuration(
                          routeItem.durationMillis
                        )}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}