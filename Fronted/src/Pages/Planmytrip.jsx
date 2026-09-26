import {
  useState,
} from "react";

import {
  useAuth,
} from "@clerk/react";

import {
  generateMyTrip,
} from "../lib/api";


const ChevronDown = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);


const options = {
  days: [
    "1 day",
    "2 days",
    "3 days",
    "4 days",
    "5 days",
  ],

  budget: [
    "Rs. 2,000 – 5,000",
    "Rs. 5,000 – 10,000",
    "Rs. 10,000 – 20,000",
    "Rs. 20,000+",
  ],

  traveling: [
    "Solo",
    "Couple",
    "Family",
    "Friends",
  ],

  transportation: [
    "Walking",
    "Bicycle",
    "Bus",
    "Car/Taxi",
  ],
};


const interestOptions = [
  "Nature",
  "Wildlife",
  "Food",
  "Culture",
  "Adventure",
];


function SelectBox({
  label,
  value,
  onChange,
  items = [],
}) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#687774]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-transparent bg-transparent px-5 py-2 text-[16px] text-[#243b36] outline-none transition focus:border-[#167565]"
        >
          {items.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#65736f]">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}


function formatDays(days) {
  return Number(
    String(days).split(" ")[0]
  );
}


function Planmytrip() {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [days, setDays] =
    useState("2 days");

  const [budget, setBudget] =
    useState(
      "Rs. 5,000 – 10,000"
    );

  const [
    traveling,
    setTraveling,
  ] = useState("Family");

  const [
    transportation,
    setTransportation,
  ] = useState("Car/Taxi");

  const [
    interests,
    setInterests,
  ] = useState([
    "Nature",
    "Wildlife",
    "Food",
    "Culture",
    "Adventure",
  ]);

  const [
    itinerary,
    setItinerary,
  ] = useState([]);

  const [
    totalCost,
    setTotalCost,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const toggleInterest = (
    interest
  ) => {
    setInterests(
      (current) =>
        current.includes(interest)
          ? current.filter(
            (item) =>
              item !== interest
          )
          : [
            ...current,
            interest,
          ]
    );
  };


  const handleGenerateTrip =
    async () => {
      setError("");

      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setError(
          "Please sign in before generating your trip."
        );

        return;
      }

      if (
        interests.length === 0
      ) {
        setError(
          "Please select at least one interest."
        );

        return;
      }

      try {
        setLoading(true);

        const token =
          await getToken();

        if (!token) {
          throw new Error(
            "Authentication token could not be created."
          );
        }

        const preferences = {
          days: formatDays(days),

          budget,

          travelingWith:
            traveling,

          transportation,

          interests,
        };

        console.log(
          "GENERATING TRIP WITH:",
          preferences
        );

        const result =
          await generateMyTrip(
            preferences,
            token
          );

        console.log(
          "GENERATED TRIP:",
          result
        );

        const generatedTrip =
          result?.trip;

        if (!generatedTrip) {
          throw new Error(
            "Trip generation returned no itinerary."
          );
        }

        /*
         * Backend now returns:
         *
         * trip.days
         * trip.estimatedCost
         *
         * instead of:
         *
         * trip.itinerary
         * trip.totalEstimatedCost
         */

        setItinerary(
          Array.isArray(
            generatedTrip.days
          )
            ? generatedTrip.days
            : []
        );

        setTotalCost(
          Number(
            generatedTrip.estimatedCost
          ) || 0
        );

      } catch (err) {
        console.error(
          "Trip generation failed:",
          err
        );

        setError(
          err.message ||
          "Unable to generate your trip."
        );

      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#173b34]">

      <main className="mx-auto max-w-[1325px] px-5 py-10 md:px-8 md:py-12">

        {/* HERO */}

        <section className="mb-9">

          <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#697a76]">
            Smart Trip Planner
          </p>

          <h1 className="text-[38px] font-extrabold leading-none tracking-[-1.5px] text-[#173b34] md:text-[46px]">
            Build your perfect trip
          </h1>

          <p className="mt-4 text-[16px] text-[#71807c]">
            Tell us what matters
            to you. Bharatpur AI
            will build a practical
            itinerary.
          </p>

        </section>


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* CONTENT */}

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[560px_1fr]">

          {/* LEFT */}

          <div className="rounded-[20px] bg-white px-6 py-7 shadow-[0_3px_15px_rgba(20,50,40,0.025)] md:px-8">

            <SelectBox
              label="How many days?"
              value={days}
              onChange={setDays}
              items={options.days}
            />


            <SelectBox
              label="Budget"
              value={budget}
              onChange={setBudget}
              items={options.budget}
            />


            <SelectBox
              label="Traveling with"
              value={traveling}
              onChange={setTraveling}
              items={options.traveling}
            />


            <SelectBox
              label="Transportation"
              value={transportation}
              onChange={
                setTransportation
              }
              items={
                options.transportation
              }
            />


            {/* INTERESTS */}

            <div>

              <label className="mb-4 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#687774]">
                Interests
              </label>

              <div className="flex flex-wrap gap-3">

                {interestOptions.map(
                  (interest) => {

                    const active =
                      interests.includes(
                        interest
                      );

                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() =>
                          toggleInterest(
                            interest
                          )
                        }
                        className={`min-w-[115px] rounded-full px-5 py-2.5 text-[13px] font-medium transition ${active
                            ? "bg-[#e9f2ef] text-[#29453e]"
                            : "bg-[#f7f9f8] text-[#596b67]"
                          } hover:bg-[#dcece7]`}
                      >
                        {interest}
                      </button>
                    );
                  }
                )}

              </div>

            </div>


            {/* SELECTED SUMMARY */}

            <div className="mt-8 rounded-2xl bg-[#f5f8f6] p-5">

              <p className="text-xs font-bold uppercase tracking-[0.06em] text-[#71807c]">
                Your preferences
              </p>

              <div className="mt-3 space-y-1 text-sm text-[#30463f]">

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {days}
                </p>

                <p>
                  <strong>
                    Budget:
                  </strong>{" "}
                  {budget}
                </p>

                <p>
                  <strong>
                    Traveling:
                  </strong>{" "}
                  {traveling}
                </p>

                <p>
                  <strong>
                    Transport:
                  </strong>{" "}
                  {transportation}
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex min-h-[590px] flex-col rounded-[20px] bg-white px-6 py-7 shadow-[0_3px_15px_rgba(20,50,40,0.025)] md:px-10">

            <div className="flex flex-col justify-between gap-4 sm:flex-row">

              <div>

                <h2 className="text-[28px] font-extrabold tracking-[-0.5px] text-[#173b34]">
                  Your AI itinerary
                </h2>

                <p className="mt-1 text-sm text-[#74817e]">
                  {itinerary.length
                    ? `${itinerary.length} day itinerary`
                    : "Generate your personalized trip"}
                </p>

              </div>


              {totalCost > 0 && (
                <div className="rounded-xl bg-[#e9f2ef] px-4 py-3">

                  <p className="text-[11px] font-bold uppercase text-[#71807c]">
                    Estimated cost
                  </p>

                  <p className="text-lg font-extrabold text-[#187967]">
                    Rs.{" "}
                    {totalCost.toLocaleString()}
                  </p>

                </div>
              )}

            </div>


            {/* ITINERARY */}

            {itinerary.length === 0 ? (

              <div className="flex flex-1 items-center justify-center">

                <div className="max-w-sm text-center">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f2ef] text-2xl">
                    ✨
                  </div>

                  <h3 className="text-xl font-bold text-[#173b34]">
                    Ready to plan
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#73817e]">
                    Select your
                    preferences and
                    generate a
                    personalized
                    Bharatpur trip.
                  </p>

                </div>

              </div>

            ) : (

              <div className="mt-7 max-h-[470px] space-y-5 overflow-y-auto pr-2">

                {itinerary.map(
                  (day) => (

                    <div
                      key={day.day}
                      className="rounded-2xl border border-[#e1e7e4] p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-[#74817e]">
                            Day{" "}
                            {day.day}
                          </p>

                          <h3 className="mt-1 text-xl font-bold text-[#173b34]">
                            {day.title}
                          </h3>

                        </div>

                        <span className="rounded-full bg-[#f2f6f4] px-3 py-1 text-xs font-semibold text-[#596b67]">
                          Rs.{" "}
                          {(
                            day.estimatedCost ||
                            0
                          ).toLocaleString()}
                        </span>

                      </div>


                      <div className="mt-5 space-y-4">

                        {day.places?.map(
                          (
                            item,
                            index
                          ) => {

                            const place =
                              item.placeId;

                            if (!place) {
                              return null;
                            }

                            return (
                              <div
                                key={`${day.day}-${place._id || index}`}
                                className="flex gap-4"
                              >

                                <div className="flex w-[80px] shrink-0 flex-col">

                                  <span className="text-xs font-bold text-[#187967]">
                                    {item.startTime ||
                                      "--"}
                                  </span>

                                  <span className="mt-1 text-[11px] text-[#89938f]">
                                    {item.durationMinutes
                                      ? `${item.durationMinutes} min`
                                      : ""}
                                  </span>

                                </div>


                                <div className="relative flex-1 border-l border-[#dce4e0] pl-4">

                                  <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#187967]" />

                                  <h4 className="font-bold text-[#30463f]">
                                    {place.name}
                                  </h4>

                                  <p className="mt-1 text-sm text-[#73817e]">
                                    {item.reason ||
                                      "Recommended for your trip."}
                                  </p>

                                  {place.location && (
                                    <p className="mt-1 text-xs text-[#8a9692]">
                                      {place.location}
                                    </p>
                                  )}

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}


            {/* BUTTONS */}

            <div className="mt-auto grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2">

              <button
                type="button"
                onClick={
                  handleGenerateTrip
                }
                disabled={
                  loading ||
                  !isLoaded
                }
                className="rounded-full bg-[#187967] py-4 text-[14px] font-bold text-white transition hover:bg-[#126554] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Generating..."
                  : "Generate My Trip"}
              </button>


              <button
                type="button"
                onClick={() =>
                  alert(
                    "Map view will be connected to your Google Maps navigation system next."
                  )
                }
                disabled={
                  itinerary.length === 0
                }
                className="rounded-full border border-[#d8dfdc] bg-white py-4 text-[14px] font-bold text-[#30463f] transition hover:bg-[#f5f8f6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                View on Map
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


export default Planmytrip;