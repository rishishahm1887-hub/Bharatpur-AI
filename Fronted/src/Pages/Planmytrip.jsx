import { useState } from "react";

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
  days: ["1 day", "2 days", "3 days", "4 days", "5 days"],
  budget: [
    "Rs. 2,000 – 5,000",
    "Rs. 5,000 – 10,000",
    "Rs. 10,000 – 20,000",
    "Rs. 20,000+",
  ],
  traveling: ["Solo", "Couple", "Family", "Friends"],
  transportation: ["Car / taxi", "Bus", "Bike", "Walking"],
};

function SelectBox({ label, value, onChange, items }) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#687774]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-transparent bg-transparent px-5 py-2 text-[16px] text-[#243b36] outline-none transition focus:border-[#167565]"
        >
          {items.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#65736f]">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function Planmytrip() {
  const [days, setDays] = useState("2 days");
  const [budget, setBudget] = useState("Rs. 5,000 – 10,000");
  const [traveling, setTraveling] = useState("Family");
  const [transportation, setTransportation] = useState("Car / taxi");

  const [interests, setInterests] = useState([
    "Nature",
    "Wildlife",
    "Food",
    "Culture",
    "Adventure",
  ]);

  const toggleInterest = (interest) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const generateTrip = () => {
    alert(
      `Trip generated!\n\n${days}\n${budget}\n${traveling}\n${transportation}\nInterests: ${interests.join(
        ", "
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-[#173b34]">

      {/* ================= MAIN PAGE ================= */}
      <main className="mx-auto max-w-[1325px] px-8 py-12">

        {/* HERO */}
        <section className="mb-9">
          <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#697a76]">
            Smart Trip Planner
          </p>

          <h1 className="text-[44px] font-extrabold leading-none tracking-[-1.5px] text-[#173b34] md:text-[46px]">
            Build your perfect trip
          </h1>

          <p className="mt-4 text-[16px] text-[#71807c]">
            Tell us what matters to you. AI will build a practical itinerary.
          </p>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[560px_1fr]">

          {/* ================= LEFT CARD ================= */}
          <div className="rounded-[20px] bg-white px-8 py-7 shadow-[0_3px_15px_rgba(20,50,40,0.025)]">

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
              onChange={setTransportation}
              items={options.transportation}
            />

            {/* INTERESTS */}
            <div>
              <label className="mb-4 block text-[13px] font-bold uppercase tracking-[0.06em] text-[#687774]">
                Interests
              </label>

              <div className="flex flex-wrap gap-4">
                {[
                  "Nature",
                  "Wildlife",
                  "Food",
                  "Culture",
                  "Adventure",
                ].map((interest) => {
                  const active = interests.includes(interest);

                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`min-w-[125px] rounded-full px-5 py-2 text-[13px] font-medium transition ${
                        active
                          ? "bg-[#e9f2ef] text-[#29453e]"
                          : "bg-[#f7f9f8] text-[#596b67]"
                      } hover:bg-[#dcece7]`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT CARD ================= */}
          <div className="flex min-h-[590px] flex-col rounded-[20px] bg-white px-10 py-7 shadow-[0_3px_15px_rgba(20,50,40,0.025)]">

            <h2 className="text-[28px] font-extrabold tracking-[-0.5px] text-[#173b34]">
              Your AI itinerary
            </h2>

            {/* DAY 1 */}
            <div className="mt-9">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.07em] text-[#74817e]">
                Day 1
              </p>

              <h3 className="text-[21px] font-bold text-[#173b34]">
                Nature + Wildlife
              </h3>

              <p className="mt-2 text-[16px] text-[#73817e]">
                Park • Lunch • Riverside
              </p>
            </div>

            <div className="my-5 h-px bg-[#dfe4e2]" />

            {/* DAY 2 */}
            <div className="mt-6">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.07em] text-[#74817e]">
                Day 2
              </p>

              <h3 className="text-[21px] font-bold text-[#173b34]">
                Culture + Local Food
              </h3>

              <p className="mt-2 text-[16px] text-[#73817e]">
                Tharu experience • Market • Dinner
              </p>
            </div>

            <div className="my-5 h-px bg-[#dfe4e2]" />

            {/* BUTTONS */}
            <div className="mt-auto grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2">

              <button
                onClick={generateTrip}
                className="rounded-full bg-[#187967] py-4 text-[14px] font-bold text-white transition hover:bg-[#126554] active:scale-[0.99]"
              >
                Generate My Trip
              </button>

              <button
                onClick={() => alert("Map view coming soon!")}
                className="rounded-full border border-[#d8dfdc] bg-white py-4 text-[14px] font-bold text-[#30463f] transition hover:bg-[#f5f8f6]"
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