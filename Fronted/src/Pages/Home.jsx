import {
  ChevronRight,
  Compass,
  PawPrint,
  Mountain,
  Landmark,
  Utensils,
  House,
  CalendarDays,
  MapPin,
  Star,
  Leaf,
  Camera,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Nature",
    subtitle: "Wildlife, parks, rivers",
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=85",
    icon: PawPrint,
    iconBg: "bg-emerald-700",
    arrow: "text-emerald-700",
  },
  {
    title: "Wildlife",
    subtitle: "Safaris, bird watching",
    image:
      "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=85",
    icon: Mountain,
    iconBg: "bg-lime-700",
    arrow: "text-lime-700",
  },
  {
    title: "Culture",
    subtitle: "Temples, heritage, local life",
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=900&q=85",
    icon: Landmark,
    iconBg: "bg-amber-500",
    arrow: "text-amber-600",
  },
  {
    title: "Food",
    subtitle: "Local cuisine, restaurants",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    icon: Utensils,
    iconBg: "bg-red-500",
    arrow: "text-red-500",
  },
  {
    title: "Homestays",
    subtitle: "Stay with locals",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=85",
    icon: House,
    iconBg: "bg-sky-600",
    arrow: "text-sky-600",
  },
  {
    title: "Events",
    subtitle: "Festivals, fairs, activities",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=900&q=85",
    icon: CalendarDays,
    iconBg: "bg-purple-600",
    arrow: "text-purple-600",
  },
];

const popularPlaces = [
  {
    title: "Chitwan National Park",
    description:
      "Home to one-horned rhinos and rich wildlife",
    location: "Chitwan",
    rating: "4.8",
    reviews: "2.4k",
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=500&q=85",
  },
  {
    title: "Sunset View at Narayani River",
    description:
      "Peaceful views and local boat rides",
    location: "Bharatpur",
    rating: "4.6",
    reviews: "1.2k",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=85",
  },
  {
    title: "Bharatpur Museum",
    description:
      "History, culture and local heritage",
    location: "Bharatpur",
    rating: "4.5",
    reviews: "892",
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=500&q=85",
  },
];

const Home = () => {
  const navigate = useNavigate();

  /* =====================================================
     OPEN EXPLORE CATEGORY
  ===================================================== */

  const openCategory = (category) => {
    navigate(
      `/explore?category=${encodeURIComponent(category)}`
    );
  };

  /* =====================================================
     OPEN POPULAR PLACE
  ===================================================== */

  const openPopularPlace = (place) => {
    navigate(
      `/explore?search=${encodeURIComponent(
        place.title
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-yellow-100/30 blur-3xl" />

        <div
          className="
            relative mx-auto
            grid max-w-[1500px]
            items-center
            gap-10
            px-5 py-12
            md:px-10
            lg:grid-cols-[0.98fr_1.02fr]
            lg:gap-14
            lg:py-12
          "
        >

          {/* Hero Text */}

          <div>

            <div
              className="
                mb-4 flex items-center gap-3
                text-sm font-semibold
                tracking-wide text-emerald-800
              "
            >
              <span className="h-[3px] w-8 rounded-full bg-emerald-700" />

              YOUR AI-POWERED LOCAL GUIDE
            </div>

            <h2
              className="
                max-w-[620px]
                text-5xl font-extrabold
                leading-[1.05]
                tracking-tight
                text-slate-900
                sm:text-6xl
              "
            >
              Discover Bharatpur,

              <span className="block text-emerald-700">
                your way.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-[600px]
                text-base
                leading-7
                text-slate-600
                sm:text-lg
              "
            >
              Plan meaningful trips, discover local
              experiences, and get instant help in English,
              नेपाली, or हिन्दी — all in one place.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  navigate("/plan-my-trip")
                }
                className="
                  group
                  flex items-center
                  justify-center gap-3
                  rounded-full
                  bg-emerald-700
                  px-7 py-4
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-emerald-700/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-emerald-800
                "
              >
                <Compass size={21} />

                Plan My Trip

                <ChevronRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() =>
                  navigate("/ai-guides")
                }
                className="
                  flex items-center
                  justify-center gap-3
                  rounded-full
                  border border-emerald-700
                  bg-white
                  px-7 py-4
                  font-semibold
                  text-emerald-800
                  transition
                  hover:bg-emerald-50
                "
              >
                <Leaf size={20} />

                Ask AI Guide
              </button>

            </div>

          </div>

          {/* Hero Image */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[26px]
              border border-white/70
              shadow-2xl
              shadow-slate-900/10
            "
          >

            <img
              src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1500&q=90"
              alt="Chitwan National Park"
              className="
                h-[330px]
                w-full
                object-cover
                sm:h-[400px]
              "
            />

            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-black/70
                via-black/15
                to-black/5
              "
            />

            <div
              className="
                absolute left-7 top-7
                flex items-center gap-2
                text-sm font-semibold
                text-white
              "
            >
              <MapPin size={21} fill="white" />

              Chitwan National Park
            </div>

            <div
              className="
                absolute
                bottom-7 left-7 right-7
                text-white
              "
            >

              <h3
                className="
                  max-w-[500px]
                  text-4xl font-extrabold
                  leading-[1.05]
                  sm:text-5xl
                "
              >
                Explore beyond

                <span className="block">
                  the usual.
                </span>
              </h3>

              <div
                className="
                  mt-5 flex flex-wrap
                  items-center
                  gap-x-5 gap-y-2
                  text-sm font-medium
                "
              >

                <span className="flex items-center gap-2">
                  <PawPrint size={18} />
                  Wildlife
                </span>

                <span className="h-4 w-px bg-white/50" />

                <span className="flex items-center gap-2">
                  <Leaf size={18} />
                  Nature
                </span>

                <span className="h-4 w-px bg-white/50" />

                <span className="flex items-center gap-2">
                  <Camera size={18} />
                  Culture
                </span>

              </div>

              <button
                onClick={() =>
                  openCategory("Wildlife")
                }
                className="
                  mt-6
                  flex items-center gap-2
                  rounded-full
                  bg-white
                  px-5 py-3
                  text-sm font-semibold
                  text-emerald-800
                  transition
                  hover:bg-emerald-50
                "
              >
                Explore Chitwan

                <ChevronRight size={18} />
              </button>

            </div>

            <div
              className="
                absolute bottom-5 right-6
                flex gap-2
              "
            >
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={`
                    h-2.5 w-2.5
                    rounded-full
                    border border-white
                    ${dot === 0
                      ? "bg-white"
                      : "bg-white/20"
                    }
                  `}
                />
              ))}
            </div>

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <div
        className="
          mx-auto
          grid max-w-[1500px]
          grid-cols-1
          gap-8
          px-5
          md:px-10
          lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.9fr)]
        "
      >

        {/* ================= CATEGORIES ================= */}

        <section className="py-8">

          <div className="mb-5 flex items-center gap-3">

            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-full
                bg-emerald-800
                text-white
              "
            >
              <Compass size={20} />
            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-extrabold
                  text-slate-800
                  sm:text-3xl
                "
              >
                What are you looking for?
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  sm:text-base
                "
              >
                Explore the best of Bharatpur —
                nature, culture, adventure and more.
              </p>

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >

            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() =>
                    openCategory(item.title)
                  }
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    text-left
                    shadow-sm
                    transition duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  <div
                    className="
                      relative
                      h-[120px]
                      overflow-hidden
                    "
                  >

                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                        h-full w-full
                        object-cover
                        transition duration-500
                        group-hover:scale-105
                      "
                    />

                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/30
                        to-transparent
                      "
                    />

                  </div>

                  <div
                    className="
                      flex items-center gap-3
                      p-4
                    "
                  >

                    <div
                      className={`
                        flex h-11 w-11
                        shrink-0
                        items-center justify-center
                        rounded-full
                        ${item.iconBg}
                        text-white
                      `}
                    >
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h4
                        className="
                          font-bold
                          text-slate-800
                        "
                      >
                        {item.title}
                      </h4>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-slate-500
                        "
                      >
                        {item.subtitle}
                      </p>

                    </div>

                    <ChevronRight
                      size={21}
                      className={`
                        ${item.arrow}
                        transition
                        group-hover:translate-x-1
                      `}
                    />

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* ================= POPULAR ================= */}

        <section className="py-8">

          <div
            className="
              rounded-[26px]
              border border-emerald-100
              bg-emerald-50/40
              p-5 sm:p-6
            "
          >

            <div
              className="
                mb-4
                flex items-center
                justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    bg-emerald-800
                    text-white
                  "
                >
                  <Leaf size={21} />
                </div>

                <h2
                  className="
                    text-2xl
                    font-extrabold
                    text-emerald-900
                  "
                >
                  Popular right now
                </h2>

              </div>

              <button
                onClick={() =>
                  navigate("/explore")
                }
                className="
                  hidden
                  items-center gap-1
                  text-sm font-medium
                  text-emerald-800
                  sm:flex
                "
              >
                See all

                <ChevronRight size={17} />
              </button>

            </div>

            <div className="space-y-3">

              {popularPlaces.map((place) => (
                <button
                  key={place.title}
                  type="button"
                  onClick={() =>
                    openPopularPlace(place)
                  }
                  className="
                    group
                    flex w-full gap-4
                    rounded-2xl
                    border border-slate-100
                    bg-white
                    p-3
                    text-left
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >

                  <img
                    src={place.image}
                    alt={place.title}
                    className="
                      h-[82px]
                      w-[110px]
                      shrink-0
                      rounded-xl
                      object-cover
                    "
                  />

                  <div
                    className="
                      min-w-0
                      flex-1
                      py-1
                    "
                  >

                    <h4
                      className="
                        truncate
                        font-bold
                        text-slate-800
                      "
                    >
                      {place.title}
                    </h4>

                    <p
                      className="
                        mt-1
                        line-clamp-1
                        text-xs
                        text-slate-500
                      "
                    >
                      {place.description}
                    </p>

                    <div
                      className="
                        mt-2
                        flex flex-wrap
                        items-center
                        gap-3
                        text-xs
                        text-slate-500
                      "
                    >

                      <span
                        className="
                          flex items-center gap-1
                        "
                      >
                        <MapPin size={13} />
                        {place.location}
                      </span>

                      <span
                        className="
                          flex items-center gap-1
                        "
                      >
                        <Star
                          size={13}
                          className="
                            fill-amber-400
                            text-amber-400
                          "
                        />

                        {place.rating}
                        ({place.reviews})
                      </span>

                    </div>

                  </div>

                  <ChevronRight
                    size={20}
                    className="
                      mt-7
                      shrink-0
                      text-slate-500
                      transition
                      group-hover:translate-x-1
                      group-hover:text-emerald-700
                    "
                  />

                </button>
              ))}

            </div>

            <button
              onClick={() =>
                navigate("/explore")
              }
              className="
                mt-4
                flex w-full
                items-center
                justify-center
                gap-1
                rounded-xl
                py-3
                text-sm
                font-semibold
                text-emerald-800
                hover:bg-emerald-100
                sm:hidden
              "
            >
              See all

              <ChevronRight size={17} />
            </button>

          </div>

        </section>

      </div>

      {/* ================= FOOTER ================= */}

      <footer
        className="
          border-t
          bg-slate-50
          px-5 py-6
          text-center
          text-sm
          text-slate-500
        "
      >
        <span className="font-semibold text-emerald-800">
          Bharatpur AI
        </span>

        {" "}• Your AI-powered tourism guide
      </footer>

    </div>
  );
};

export default Home;