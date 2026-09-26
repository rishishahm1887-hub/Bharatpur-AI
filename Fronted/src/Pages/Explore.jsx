// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// // import { resolvePlace } from "../lib/api";
// import {
//   resolvePlace,
//   addMyTrip,
// } from "../lib/api";

// import { useAuth } from "@clerk/react";

// const {
//   isLoaded,
//   isSignedIn,
//   getToken,
// } = useAuth();

// import {
//   Search,
//   MapPin,
//   Star,
//   X,
//   Navigation,
//   Plus,
//   Check,
//   ArrowRight,
//   SlidersHorizontal,
//   Sparkles,
//   RefreshCw,
// } from "lucide-react";

// import {
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";

// import placesData from "../data/places.json";


// const Explore = () => {

//   const navigate = useNavigate();

//   const [
//     searchParams,
//     setSearchParams,
//   ] = useSearchParams();


//   /* =====================================================
//      STATES
//   ===================================================== */

//   const [search, setSearch] = useState(
//     searchParams.get("search") || ""
//   );

//   const [
//     resolvingPlaceId,
//     setResolvingPlaceId,
//   ] = useState(null);

//   const [
//     activeCategory,
//     setActiveCategory,
//   ] = useState(
//     searchParams.get("category") || "All"
//   );

//   const [
//     selectedPlace,
//     setSelectedPlace,
//   ] = useState(null);

//   const [
//     showFilters,
//     setShowFilters,
//   ] = useState(false);

//   const [
//     addedPlaceId,
//     setAddedPlaceId,
//   ] = useState(null);


//   /* =====================================================
//      CATEGORIES
//   ===================================================== */

//   const categories = [
//     "All",
//     "Nature",
//     "Wildlife",
//     "Culture",
//     "Food",
//     "Homestays",
//     "Events",
//     "Hidden Places",
//   ];


//   /* =====================================================
//      SYNC URL → STATE
//   ===================================================== */

//   useEffect(() => {

//     const category =
//       searchParams.get("category");

//     const searchQuery =
//       searchParams.get("search");

//     setActiveCategory(
//       category || "All"
//     );

//     setSearch(
//       searchQuery || ""
//     );

//   }, [searchParams]);


//   /* =====================================================
//      FILTER PLACES
//   ===================================================== */

//   const filteredPlaces = useMemo(() => {

//     const places =
//       placesData.places || [];

//     const searchText =
//       search.trim().toLowerCase();

//     return places.filter((place) => {

//       /* -----------------------------------------------
//          SEARCH
//       ----------------------------------------------- */

//       const matchesSearch =
//         !searchText ||
//         place.name
//           ?.toLowerCase()
//           .includes(searchText) ||

//         place.description
//           ?.toLowerCase()
//           .includes(searchText) ||

//         place.location
//           ?.toLowerCase()
//           .includes(searchText) ||

//         place.category?.some(
//           (category) =>
//             category
//               .toLowerCase()
//               .includes(searchText)
//         );


//       /* -----------------------------------------------
//          CATEGORY
//       ----------------------------------------------- */

//       const matchesCategory =
//         activeCategory === "All" ||
//         place.category?.some(
//           (category) =>
//             category.toLowerCase() ===
//             activeCategory.toLowerCase()
//         );


//       return (
//         matchesSearch &&
//         matchesCategory
//       );

//     });

//   }, [
//     search,
//     activeCategory,
//   ]);


//   /* =====================================================
//      UPDATE CATEGORY
//   ===================================================== */

//   const handleCategoryChange = (
//     category
//   ) => {

//     setActiveCategory(category);

//     const nextParams =
//       new URLSearchParams(
//         searchParams
//       );


//     if (category === "All") {

//       nextParams.delete(
//         "category"
//       );

//     } else {

//       nextParams.set(
//         "category",
//         category
//       );

//     }


//     setSearchParams(
//       nextParams
//     );

//   };


//   /* =====================================================
//      UPDATE SEARCH
//   ===================================================== */

//   const handleSearchChange = (
//     value
//   ) => {

//     setSearch(value);

//     const nextParams =
//       new URLSearchParams(
//         searchParams
//       );


//     if (value.trim()) {

//       nextParams.set(
//         "search",
//         value
//       );

//     } else {

//       nextParams.delete(
//         "search"
//       );

//     }


//     setSearchParams(
//       nextParams
//     );

//   };


//   /* =====================================================
//      CLEAR FILTERS
//   ===================================================== */

//   const clearFilters = () => {

//     setSearch("");

//     setActiveCategory(
//       "All"
//     );

//     setSearchParams({});

//   };


//   /* =====================================================
//      ADD PLACE TO MY TRIP
//   ===================================================== */

//   const addToMyTrip = (
//     place
//   ) => {

//     const savedTrips =
//       JSON.parse(
//         localStorage.getItem(
//           "bharatpurMyTrips"
//         )
//       ) || [];


//     const alreadyExists =
//       savedTrips.some(
//         (trip) =>
//           trip.id === place.id
//       );


//     if (alreadyExists) {

//       setAddedPlaceId(
//         place.id
//       );

//       return;

//     }


//     const updatedTrips = [
//       ...savedTrips,
//       place,
//     ];


//     localStorage.setItem(
//       "bharatpurMyTrips",
//       JSON.stringify(
//         updatedTrips
//       )
//     );


//     setAddedPlaceId(
//       place.id
//     );

//   };


//   /* =====================================================
//      OPEN DIRECTIONS
//   ===================================================== */

//   const openDirections = async (
//     place
//   ) => {

//     try {

//       if (!place) {
//         throw new Error(
//           "Place information is missing."
//         );
//       }


//       if (!place.name) {
//         throw new Error(
//           "Place name is missing."
//         );
//       }


//       setResolvingPlaceId(
//         place.id
//       );


//       console.log(
//         "🧭 Explore → Directions:",
//         place
//       );


//       console.log(
//         "🔎 Resolving:",
//         place.name
//       );


//       const resolved =
//         await resolvePlace(
//           place.name
//         );


//       console.log(
//         "✅ Resolved place:",
//         resolved
//       );


//       if (!resolved?._id) {

//         throw new Error(
//           "Place could not be resolved."
//         );

//       }


//       if (
//         !resolved.googlePlaceId
//       ) {

//         throw new Error(
//           "Google Place ID is missing."
//         );

//       }


//       console.log(
//         "🆔 MongoDB Place ID:",
//         resolved._id
//       );


//       console.log(
//         "🗺️ Opening Google navigation..."
//       );


//       /*
//        * Use the MongoDB Place ID.
//        *
//        * Placemap supports:
//        *
//        * /places/:id/map
//        *
//        * and
//        *
//        * /place-map?id=:id
//        */

//       navigate(
//         `/places/${resolved._id}/map`
//       );

//     } catch (error) {

//       console.error(
//         "❌ Place resolution error:",
//         error
//       );


//       alert(
//         error?.message ||
//         "Unable to load place."
//       );

//     } finally {

//       setResolvingPlaceId(
//         null
//       );

//     }

//   };


//   /* =====================================================
//      CLOSE MODAL
//   ===================================================== */

//   const closeModal = () => {

//     setSelectedPlace(
//       null
//     );

//   };


//   /* =====================================================
//      OPEN DETAILS
//   ===================================================== */

//   const openDetails = (
//     place
//   ) => {

//     setSelectedPlace(
//       place
//     );


//     const savedTrips =
//       JSON.parse(
//         localStorage.getItem(
//           "bharatpurMyTrips"
//         )
//       ) || [];


//     const alreadySaved =
//       savedTrips.some(
//         (trip) =>
//           trip.id === place.id
//       );


//     setAddedPlaceId(
//       alreadySaved
//         ? place.id
//         : null
//     );

//   };


//   return (

//     <div
//       className="
//         min-h-screen
//         bg-gradient-to-b
//         from-[#f6faf8]
//         via-white
//         to-white
//         text-slate-800
//       "
//     >

//       {/* =================================================
//           PAGE HEADER
//       ================================================= */}

//       <section
//         className="
//           mx-auto
//           max-w-[1400px]
//           px-5
//           pb-8
//           pt-10
//           md:px-10
//           lg:pt-14
//         "
//       >

//         {/* Small heading */}

//         <div
//           className="
//             flex
//             items-center
//             gap-2
//             text-xs
//             font-bold
//             tracking-[0.18em]
//             text-emerald-700
//           "
//         >

//           <span
//             className="
//               h-[3px]
//               w-8
//               rounded-full
//               bg-emerald-700
//             "
//           />

//           DISCOVER

//         </div>


//         {/* Main heading */}

//         <div
//           className="
//             mt-3
//             flex
//             flex-col
//             gap-4
//             md:flex-row
//             md:items-end
//             md:justify-between
//           "
//         >

//           <div>

//             <h1
//               className="
//                 text-4xl
//                 font-extrabold
//                 tracking-tight
//                 text-[#073b3a]
//                 sm:text-5xl
//               "
//             >
//               Explore Bharatpur
//             </h1>


//             <p
//               className="
//                 mt-3
//                 max-w-2xl
//                 text-base
//                 leading-7
//                 text-slate-500
//               "
//             >
//               Find destinations, food, stays,
//               events, and local experiences.
//             </p>

//           </div>


//           <div
//             className="
//               hidden
//               items-center
//               gap-2
//               rounded-full
//               border
//               border-emerald-100
//               bg-white
//               px-4
//               py-2
//               text-sm
//               font-semibold
//               text-emerald-700
//               shadow-sm
//               md:flex
//             "
//           >

//             <Sparkles size={16} />

//             Discover something new

//           </div>

//         </div>


//         {/* =================================================
//             SEARCH
//         ================================================= */}

//         <div
//           className="
//             mt-8
//             flex
//             gap-3
//           "
//         >

//           <div
//             className="
//               relative
//               flex-1
//             "
//           >

//             <Search
//               size={21}
//               className="
//                 absolute
//                 left-5
//                 top-1/2
//                 -translate-y-1/2
//                 text-slate-400
//               "
//             />


//             <input
//               type="text"
//               value={search}
//               onChange={(e) =>
//                 handleSearchChange(
//                   e.target.value
//                 )
//               }
//               placeholder="
//                 Search destinations, experiences, restaurants...
//               "
//               className="
//                 h-16
//                 w-full
//                 rounded-2xl
//                 border
//                 border-slate-100
//                 bg-white
//                 pl-14
//                 pr-5
//                 text-sm
//                 text-slate-800
//                 shadow-sm
//                 outline-none
//                 transition
//                 placeholder:text-slate-400
//                 focus:border-emerald-300
//                 focus:ring-4
//                 focus:ring-emerald-50
//               "
//             />

//           </div>


//           {/* Mobile filter button */}

//           <button
//             type="button"
//             onClick={() =>
//               setShowFilters(
//                 !showFilters
//               )
//             }
//             className="
//               flex
//               h-16
//               w-16
//               shrink-0
//               items-center
//               justify-center
//               rounded-2xl
//               border
//               border-slate-200
//               bg-white
//               text-slate-600
//               shadow-sm
//               transition
//               hover:border-emerald-300
//               hover:text-emerald-700
//               md:hidden
//             "
//           >

//             <SlidersHorizontal
//               size={21}
//             />

//           </button>

//         </div>


//         {/* =================================================
//             CATEGORY FILTERS
//         ================================================= */}

//         <div
//           className={`
//             mt-6
//             flex
//             flex-wrap
//             gap-3
//             ${showFilters
//               ? "flex"
//               : "hidden md:flex"
//             }
//           `}
//         >

//           {categories.map(
//             (category) => (

//               <button
//                 key={category}
//                 type="button"
//                 onClick={() =>
//                   handleCategoryChange(
//                     category
//                   )
//                 }
//                 className={`
//                   rounded-full
//                   border
//                   px-6
//                   py-2.5
//                   text-sm
//                   font-semibold
//                   transition

//                   ${activeCategory ===
//                     category
//                     ? `
//                         border-emerald-700
//                         bg-emerald-700
//                         text-white
//                         shadow-md
//                       `
//                     : `
//                         border-slate-200
//                         bg-white
//                         text-slate-700
//                         hover:border-emerald-300
//                         hover:bg-emerald-50
//                         hover:text-emerald-700
//                       `
//                   }
//                 `}
//               >
//                 {category}
//               </button>

//             )
//           )}

//         </div>

//       </section>


//       {/* =================================================
//           RESULTS
//       ================================================= */}

//       <main
//         className="
//           mx-auto
//           max-w-[1400px]
//           px-5
//           pb-20
//           md:px-10
//         "
//       >

//         {/* Results heading */}

//         <div
//           className="
//             mb-6
//             flex
//             items-center
//             justify-between
//           "
//         >

//           <div>

//             <h2
//               className="
//                 text-2xl
//                 font-extrabold
//                 text-[#073b3a]
//                 sm:text-3xl
//               "
//             >
//               Recommended for you
//             </h2>


//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-slate-500
//               "
//             >
//               {filteredPlaces.length}{" "}
//               {filteredPlaces.length === 1
//                 ? "place"
//                 : "places"}{" "}
//               found
//             </p>

//           </div>


//           {/* Active filter indicator */}

//           {activeCategory !==
//             "All" && (

//               <div
//                 className="
//                 hidden
//                 rounded-full
//                 bg-emerald-50
//                 px-4
//                 py-2
//                 text-xs
//                 font-bold
//                 text-emerald-700
//                 sm:block
//               "
//               >
//                 {activeCategory}
//               </div>

//             )}

//         </div>


//         {/* =================================================
//             NO RESULTS
//         ================================================= */}

//         {filteredPlaces.length ===
//           0 ? (

//           <div
//             className="
//               flex
//               min-h-[350px]
//               flex-col
//               items-center
//               justify-center
//               rounded-[28px]
//               border
//               border-dashed
//               border-slate-200
//               bg-slate-50
//               px-5
//               text-center
//             "
//           >

//             <div
//               className="
//                 flex
//                 h-16
//                 w-16
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-emerald-100
//                 text-emerald-700
//               "
//             >

//               <Search
//                 size={27}
//               />

//             </div>


//             <h3
//               className="
//                 mt-5
//                 text-xl
//                 font-bold
//                 text-slate-800
//               "
//             >
//               No places found
//             </h3>


//             <p
//               className="
//                 mt-2
//                 max-w-md
//                 text-sm
//                 leading-6
//                 text-slate-500
//               "
//             >
//               Try searching for another
//               destination or choose a
//               different category.
//             </p>


//             <button
//               type="button"
//               onClick={
//                 clearFilters
//               }
//               className="
//                 mt-5
//                 rounded-full
//                 bg-emerald-700
//                 px-6
//                 py-3
//                 text-sm
//                 font-bold
//                 text-white
//                 hover:bg-emerald-800
//               "
//             >
//               Clear filters
//             </button>

//           </div>

//         ) : (

//           /* =================================================
//               PLACE GRID
//           ================================================= */

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               sm:grid-cols-2
//               lg:grid-cols-3
//               xl:grid-cols-4
//             "
//           >

//             {filteredPlaces.map(
//               (place) => (

//                 <article
//                   key={place.id}
//                   className="
//                     group
//                     overflow-hidden
//                     rounded-[22px]
//                     border
//                     border-slate-200
//                     bg-white
//                     shadow-sm
//                     transition
//                     duration-300
//                     hover:-translate-y-1
//                     hover:shadow-xl
//                   "
//                 >

//                   {/* =================================================
//                       IMAGE
//                   ================================================= */}

//                   <div
//                     className="
//                       relative
//                       h-[220px]
//                       overflow-hidden
//                     "
//                   >

//                     <img
//                       src={
//                         place.image
//                       }
//                       alt={
//                         place.name
//                       }
//                       className="
//                         h-full
//                         w-full
//                         object-cover
//                         transition
//                         duration-500
//                         group-hover:scale-105
//                       "
//                     />


//                     {/* Image overlay */}

//                     <div
//                       className="
//                         absolute
//                         inset-0
//                         bg-gradient-to-t
//                         from-black/45
//                         via-transparent
//                         to-transparent
//                       "
//                     />


//                     {/* Category */}

//                     <div
//                       className="
//                         absolute
//                         left-4
//                         top-4
//                         rounded-full
//                         bg-white/95
//                         px-3
//                         py-1.5
//                         text-xs
//                         font-bold
//                         text-emerald-800
//                         shadow-sm
//                       "
//                     >
//                       {place.category?.[0]}
//                     </div>


//                     {/* Rating */}

//                     <div
//                       className="
//                         absolute
//                         bottom-4
//                         right-4
//                         flex
//                         items-center
//                         gap-1
//                         rounded-full
//                         bg-white
//                         px-3
//                         py-1.5
//                         text-xs
//                         font-bold
//                         text-slate-800
//                         shadow-sm
//                       "
//                     >

//                       <Star
//                         size={13}
//                         className="
//                           fill-amber-400
//                           text-amber-400
//                         "
//                       />

//                       {place.rating}

//                     </div>

//                   </div>


//                   {/* =================================================
//                       CARD CONTENT
//                   ================================================= */}

//                   <div className="p-5">

//                     <h3
//                       className="
//                         line-clamp-1
//                         text-lg
//                         font-extrabold
//                         text-slate-900
//                       "
//                     >
//                       {place.name}
//                     </h3>


//                     {/* Location */}

//                     <div
//                       className="
//                         mt-2
//                         flex
//                         items-center
//                         gap-1.5
//                         text-sm
//                         text-slate-500
//                       "
//                     >

//                       <MapPin
//                         size={15}
//                         className="
//                           shrink-0
//                           text-emerald-700
//                         "
//                       />

//                       <span
//                         className="
//                           line-clamp-1
//                         "
//                       >
//                         {place.location}
//                       </span>

//                     </div>


//                     {/* Description */}

//                     <p
//                       className="
//                         mt-3
//                         line-clamp-2
//                         min-h-[48px]
//                         text-sm
//                         leading-6
//                         text-slate-500
//                       "
//                     >
//                       {place.description}
//                     </p>


//                     {/* Categories */}

//                     <div
//                       className="
//                         mt-4
//                         flex
//                         flex-wrap
//                         gap-2
//                       "
//                     >

//                       {place.category
//                         ?.slice(
//                           0,
//                           2
//                         )
//                         .map(
//                           (
//                             category
//                           ) => (

//                             <span
//                               key={
//                                 category
//                               }
//                               className="
//                                 rounded-full
//                                 bg-slate-100
//                                 px-3
//                                 py-1
//                                 text-[11px]
//                                 font-semibold
//                                 text-slate-600
//                               "
//                             >
//                               {
//                                 category
//                               }
//                             </span>

//                           )
//                         )}

//                     </div>


//                     {/* =================================================
//                         VIEW DETAILS
//                     ================================================= */}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         openDetails(
//                           place
//                         )
//                       }
//                       className="
//                         mt-5
//                         flex
//                         w-full
//                         items-center
//                         justify-center
//                         gap-2
//                         rounded-full
//                         border
//                         border-slate-200
//                         bg-white
//                         px-4
//                         py-3
//                         text-sm
//                         font-bold
//                         text-slate-800
//                         transition
//                         hover:border-emerald-600
//                         hover:bg-emerald-50
//                         hover:text-emerald-700
//                       "
//                     >

//                       View Details

//                       <ArrowRight
//                         size={16}
//                       />

//                     </button>

//                   </div>

//                 </article>

//               )
//             )}

//           </div>

//         )}

//       </main>


//       {/* =========================================================
//           DESTINATION MODAL
//       ========================================================= */}

//       {selectedPlace && (

//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             bg-slate-950/60
//             p-4
//             backdrop-blur-sm
//           "
//           onClick={
//             closeModal
//           }
//         >

//           {/* =================================================
//               MODAL
//           ================================================= */}

//           <div
//             className="
//               relative
//               max-h-[92vh]
//               w-full
//               max-w-5xl
//               overflow-y-auto
//               rounded-[28px]
//               bg-white
//               shadow-2xl
//             "
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* =================================================
//                 CLOSE BUTTON
//             ================================================= */}

//             <button
//               type="button"
//               onClick={
//                 closeModal
//               }
//               className="
//                 absolute
//                 right-5
//                 top-5
//                 z-20
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-white/95
//                 text-slate-600
//                 shadow-lg
//                 transition
//                 hover:bg-slate-100
//               "
//             >

//               <X size={20} />

//             </button>


//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 lg:grid-cols-2
//               "
//             >

//               {/* =================================================
//                   LEFT IMAGE
//               ================================================= */}

//               <div
//                 className="
//                   relative
//                   min-h-[300px]
//                   lg:min-h-[620px]
//                 "
//               >

//                 <img
//                   src={
//                     selectedPlace.image
//                   }
//                   alt={
//                     selectedPlace.name
//                   }
//                   className="
//                     absolute
//                     inset-0
//                     h-full
//                     w-full
//                     object-cover
//                   "
//                 />


//                 <div
//                   className="
//                     absolute
//                     inset-0
//                     bg-gradient-to-t
//                     from-black/65
//                     via-black/10
//                     to-transparent
//                   "
//                 />


//                 <div
//                   className="
//                     absolute
//                     bottom-7
//                     left-6
//                     right-6
//                     text-white
//                     sm:left-8
//                     sm:right-8
//                   "
//                 >

//                   <div
//                     className="
//                       mb-3
//                       flex
//                       flex-wrap
//                       gap-2
//                     "
//                   >

//                     {selectedPlace.category
//                       ?.map(
//                         (
//                           category
//                         ) => (

//                           <span
//                             key={
//                               category
//                             }
//                             className="
//                               rounded-full
//                               bg-white/20
//                               px-3
//                               py-1.5
//                               text-xs
//                               font-semibold
//                               backdrop-blur-md
//                             "
//                           >
//                             {
//                               category
//                             }
//                           </span>

//                         )
//                       )}

//                   </div>


//                   <h2
//                     className="
//                       text-3xl
//                       font-extrabold
//                       sm:text-4xl
//                     "
//                   >
//                     {
//                       selectedPlace.name
//                     }
//                   </h2>


//                   <div
//                     className="
//                       mt-3
//                       flex
//                       items-center
//                       gap-2
//                       text-sm
//                       text-white/90
//                     "
//                   >

//                     <MapPin
//                       size={17}
//                     />

//                     {
//                       selectedPlace.location
//                     }

//                   </div>

//                 </div>

//               </div>


//               {/* =================================================
//                   RIGHT DETAILS
//               ================================================= */}

//               <div
//                 className="
//                   p-6
//                   sm:p-8
//                   lg:p-10
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     items-center
//                     justify-between
//                   "
//                 >

//                   <div>

//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-[0.16em]
//                         text-emerald-700
//                       "
//                     >
//                       Destination Details
//                     </p>


//                     <h3
//                       className="
//                         mt-2
//                         text-2xl
//                         font-extrabold
//                         text-slate-900
//                       "
//                     >
//                       Plan your visit
//                     </h3>

//                   </div>


//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-1.5
//                       rounded-full
//                       bg-amber-50
//                       px-3
//                       py-2
//                       text-sm
//                       font-bold
//                       text-slate-800
//                     "
//                   >

//                     <Star
//                       size={15}
//                       className="
//                         fill-amber-400
//                         text-amber-400
//                       "
//                     />

//                     {
//                       selectedPlace.rating
//                     }

//                   </div>

//                 </div>


//                 {/* =================================================
//                     DESCRIPTION
//                 ================================================= */}

//                 <p
//                   className="
//                     mt-6
//                     text-sm
//                     leading-7
//                     text-slate-600
//                   "
//                 >
//                   {
//                     selectedPlace.description
//                   }
//                 </p>


//                 {/* =================================================
//                     INFORMATION
//                 ================================================= */}

//                 <div
//                   className="
//                     mt-7
//                     space-y-5
//                   "
//                 >

//                   <div>

//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wider
//                         text-slate-400
//                       "
//                     >
//                       Best For
//                     </p>

//                     <p
//                       className="
//                         mt-1
//                         font-bold
//                         text-slate-800
//                       "
//                     >
//                       {
//                         selectedPlace
//                           .details
//                           ?.bestFor ||
//                         "Everyone"
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wider
//                         text-slate-400
//                       "
//                     >
//                       Suggested Time
//                     </p>

//                     <p
//                       className="
//                         mt-1
//                         font-bold
//                         text-slate-800
//                       "
//                     >
//                       {
//                         selectedPlace
//                           .details
//                           ?.suggestedTime ||
//                         "2–4 hours"
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wider
//                         text-slate-400
//                       "
//                     >
//                       Cost
//                     </p>

//                     <p
//                       className="
//                         mt-1
//                         font-bold
//                         text-slate-800
//                       "
//                     >
//                       {
//                         selectedPlace
//                           .details
//                           ?.cost ||
//                         "Check current local fees"
//                       }
//                     </p>

//                   </div>


//                   <div>

//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wider
//                         text-slate-400
//                       "
//                     >
//                       Nearby
//                     </p>

//                     <p
//                       className="
//                         mt-1
//                         font-bold
//                         text-slate-800
//                       "
//                     >
//                       {
//                         selectedPlace
//                           .details
//                           ?.nearby ||
//                         "Food • Hotels • Attractions"
//                       }
//                     </p>

//                   </div>

//                 </div>


//                 {/* =================================================
//                     RATING
//                 ================================================= */}

//                 <div
//                   className="
//                     mt-7
//                     flex
//                     items-center
//                     gap-2
//                     border-t
//                     border-slate-100
//                     pt-6
//                   "
//                 >

//                   <Star
//                     size={17}
//                     className="
//                       fill-amber-400
//                       text-amber-400
//                     "
//                   />

//                   <span
//                     className="
//                       text-sm
//                       font-bold
//                       text-slate-800
//                     "
//                   >
//                     {
//                       selectedPlace.rating
//                     }
//                   </span>

//                   <span
//                     className="
//                       text-sm
//                       text-slate-400
//                     "
//                   >
//                     •
//                   </span>

//                   <span
//                     className="
//                       text-sm
//                       text-slate-500
//                     "
//                   >
//                     {
//                       selectedPlace.reviews ||
//                       0
//                     }{" "}
//                     reviews
//                   </span>

//                 </div>


//                 {/* =================================================
//                     ACTION BUTTONS
//                 ================================================= */}

//                 <div
//                   className="
//                     mt-7
//                     grid
//                     grid-cols-1
//                     gap-3
//                     sm:grid-cols-2
//                   "
//                 >

//                   {/* ADD TO TRIP */}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       addToMyTrip(
//                         selectedPlace
//                       )
//                     }
//                     className={`
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                       rounded-full
//                       px-5
//                       py-3.5
//                       text-sm
//                       font-bold
//                       transition

//                       ${addedPlaceId ===
//                         selectedPlace.id
//                         ? `
//                             bg-emerald-100
//                             text-emerald-800
//                           `
//                         : `
//                             bg-emerald-700
//                             text-white
//                             shadow-lg
//                             shadow-emerald-700/20
//                             hover:bg-emerald-800
//                           `
//                       }
//                     `}
//                   >

//                     {addedPlaceId ===
//                       selectedPlace.id ? (
//                       <>
//                         <Check
//                           size={18}
//                         />

//                         Added to My Trip
//                       </>
//                     ) : (
//                       <>
//                         <Plus
//                           size={18}
//                         />

//                         Add to My Trip
//                       </>
//                     )}

//                   </button>


//                   {/* ASK AI */}

//                   <button
//                     type="button"
//                     onClick={() => {

//                       navigate(
//                         "/ai-guides"
//                       );

//                     }}
//                     className="
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                       rounded-full
//                       border
//                       border-slate-200
//                       bg-white
//                       px-5
//                       py-3.5
//                       text-sm
//                       font-bold
//                       text-slate-800
//                       transition
//                       hover:border-emerald-500
//                       hover:bg-emerald-50
//                       hover:text-emerald-700
//                     "
//                   >

//                     <Sparkles
//                       size={17}
//                     />

//                     Ask AI About This Place

//                   </button>


//                   {/* DIRECTIONS */}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       openDirections(
//                         selectedPlace
//                       )
//                     }
//                     disabled={
//                       resolvingPlaceId ===
//                       selectedPlace.id
//                     }
//                     className="
//                       flex
//                       items-center
//                       justify-center
//                       gap-2
//                       rounded-full
//                       border
//                       border-emerald-200
//                       bg-emerald-50
//                       px-5
//                       py-3.5
//                       text-sm
//                       font-bold
//                       text-emerald-800
//                       transition
//                       hover:bg-emerald-700
//                       hover:text-white
//                       disabled:cursor-not-allowed
//                       disabled:opacity-60
//                     "
//                   >

//                     {resolvingPlaceId ===
//                       selectedPlace.id ? (
//                       <>
//                         <RefreshCw
//                           size={18}
//                           className="
//                             animate-spin
//                           "
//                         />

//                         Preparing destination...
//                       </>
//                     ) : (
//                       <>
//                         <Navigation
//                           size={18}
//                         />

//                         Directions
//                       </>
//                     )}

//                   </button>

//                 </div>


//                 {/* =================================================
//                     REVIEW
//                 ================================================= */}

//                 {selectedPlace.details
//                   ?.review && (

//                     <div
//                       className="
//                       mt-7
//                       rounded-2xl
//                       bg-slate-50
//                       p-5
//                     "
//                     >

//                       <p
//                         className="
//                         text-xs
//                         font-bold
//                         uppercase
//                         tracking-wider
//                         text-slate-400
//                       "
//                       >
//                         Visitor Review
//                       </p>


//                       <p
//                         className="
//                         mt-2
//                         text-sm
//                         italic
//                         leading-6
//                         text-slate-600
//                       "
//                       >
//                         "
//                         {
//                           selectedPlace
//                             .details
//                             .review
//                         }
//                         "
//                       </p>

//                     </div>

//                   )}

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };


// export default Explore;

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  resolvePlace,
  addMyTrip,
} from "../lib/api";

import {
  useAuth,
} from "@clerk/react";

import {
  Search,
  MapPin,
  Star,
  X,
  Navigation,
  Plus,
  Check,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import placesData from "../data/places.json";


const Explore = () => {

  /* =====================================================
     CLERK AUTH
  ===================================================== */

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();


  const navigate = useNavigate();


  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /* =====================================================
     STATES
  ===================================================== */

  const [
    search,
    setSearch,
  ] = useState(
    searchParams.get("search") || ""
  );


  const [
    resolvingPlaceId,
    setResolvingPlaceId,
  ] = useState(null);


  const [
    activeCategory,
    setActiveCategory,
  ] = useState(
    searchParams.get("category") || "All"
  );


  const [
    selectedPlace,
    setSelectedPlace,
  ] = useState(null);


  const [
    showFilters,
    setShowFilters,
  ] = useState(false);


  const [
    addedPlaceId,
    setAddedPlaceId,
  ] = useState(null);


  const [
    addingPlaceId,
    setAddingPlaceId,
  ] = useState(null);


  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    "All",
    "Nature",
    "Wildlife",
    "Culture",
    "Food",
    "Homestays",
    "Events",
    "Hidden Places",
  ];


  /* =====================================================
     SYNC URL → STATE
  ===================================================== */

  useEffect(() => {

    const category =
      searchParams.get("category");

    const searchQuery =
      searchParams.get("search");


    setActiveCategory(
      category || "All"
    );


    setSearch(
      searchQuery || ""
    );

  }, [searchParams]);


  /* =====================================================
     FILTER PLACES
  ===================================================== */

  const filteredPlaces = useMemo(() => {

    const places =
      placesData.places || [];


    const searchText =
      search.trim().toLowerCase();


    return places.filter((place) => {

      const matchesSearch =
        !searchText ||
        place.name
          ?.toLowerCase()
          .includes(searchText) ||

        place.description
          ?.toLowerCase()
          .includes(searchText) ||

        place.location
          ?.toLowerCase()
          .includes(searchText) ||

        place.category?.some(
          (category) =>
            category
              .toLowerCase()
              .includes(searchText)
        );


      const matchesCategory =
        activeCategory === "All" ||
        place.category?.some(
          (category) =>
            category.toLowerCase() ===
            activeCategory.toLowerCase()
        );


      return (
        matchesSearch &&
        matchesCategory
      );

    });

  }, [
    search,
    activeCategory,
  ]);


  /* =====================================================
     UPDATE CATEGORY
  ===================================================== */

  const handleCategoryChange = (
    category
  ) => {

    setActiveCategory(
      category
    );


    const nextParams =
      new URLSearchParams(
        searchParams
      );


    if (category === "All") {

      nextParams.delete(
        "category"
      );

    } else {

      nextParams.set(
        "category",
        category
      );

    }


    setSearchParams(
      nextParams
    );

  };


  /* =====================================================
     UPDATE SEARCH
  ===================================================== */

  const handleSearchChange = (
    value
  ) => {

    setSearch(
      value
    );


    const nextParams =
      new URLSearchParams(
        searchParams
      );


    if (value.trim()) {

      nextParams.set(
        "search",
        value
      );

    } else {

      nextParams.delete(
        "search"
      );

    }


    setSearchParams(
      nextParams
    );

  };


  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {

    setSearch("");

    setActiveCategory(
      "All"
    );

    setSearchParams({});

  };


  /* =====================================================
     ADD PLACE TO MY TRIP
     MONGODB + CLERK
  ===================================================== */

  const addToMyTrip = async (
    place
  ) => {

    try {

      if (!isLoaded) {
        return;
      }


      if (!isSignedIn) {

        alert(
          "Please sign in before adding a place to My Trip."
        );

        return;

      }


      if (!place) {

        throw new Error(
          "Place information is missing."
        );

      }


      setAddingPlaceId(
        place.id
      );


      console.log(
        "➕ Adding place to My Trip:",
        place
      );


      /* =================================================
         GET CLERK TOKEN
      ================================================= */

      const token =
        await getToken();


      if (!token) {

        throw new Error(
          "Authentication token could not be created."
        );

      }


      /* =================================================
         RESOLVE PLACE
      ================================================= */

      console.log(
        "🔎 Resolving place:",
        place.name
      );


      const result =
        await resolvePlace(
          place.name,
          token
        );


      console.log(
        "✅ Resolved place for My Trip:",
        result
      );


      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   place: {...}
       * }
       */


      const resolved =
        result?.place;


      if (!resolved?._id) {

        throw new Error(
          "Place could not be resolved in the database."
        );

      }


      console.log(
        "✅ MongoDB Place:",
        resolved
      );


      /* =================================================
         SAVE TRIP
      ================================================= */

      await addMyTrip(
        resolved._id,
        token
      );


      /* =================================================
         UPDATE UI
      ================================================= */

      setAddedPlaceId(
        place.id
      );


      console.log(
        "✅ Place added to My Trip successfully."
      );

    } catch (error) {

      console.error(
        "❌ Add to My Trip error:",
        error
      );


      /*
       * If already exists, treat it as added.
       */

      if (
        error?.message
          ?.toLowerCase()
          .includes("already")
      ) {

        setAddedPlaceId(
          place?.id
        );

        return;

      }


      alert(
        error?.message ||
        "Unable to add this place to My Trip."
      );

    } finally {

      setAddingPlaceId(
        null
      );

    }

  };


  /* =====================================================
     OPEN DIRECTIONS
  ===================================================== */

  const openDirections = async (
    place
  ) => {

    try {

      if (!isLoaded) {

        alert(
          "Google Maps is still loading. Please try again."
        );

        return;

      }


      if (!isSignedIn) {

        alert(
          "Please sign in before using directions."
        );

        return;

      }


      if (!place) {

        throw new Error(
          "Place information is missing."
        );

      }


      if (!place.name) {

        throw new Error(
          "Place name is missing."
        );

      }


      setResolvingPlaceId(
        place.id
      );


      console.log(
        "🧭 Explore → Directions:",
        place
      );


      /* =================================================
         GET CLERK TOKEN
      ================================================= */

      const token =
        await getToken();


      if (!token) {

        throw new Error(
          "Authentication token could not be created."
        );

      }


      /* =================================================
         RESOLVE PLACE
      ================================================= */

      console.log(
        "🔎 Resolving:",
        place.name
      );


      const result =
        await resolvePlace(
          place.name,
          token
        );


      console.log(
        "✅ Resolved place:",
        result
      );


      /*
       * IMPORTANT
       *
       * Backend returns:
       *
       * {
       *   success: true,
       *   place: {...}
       * }
       */


      const resolved =
        result?.place;


      if (!resolved?._id) {

        throw new Error(
          "Place could not be resolved."
        );

      }


      console.log(
        "🆔 MongoDB Place ID:",
        resolved._id
      );


      /*
       * Do NOT check googlePlaceId here.
       *
       * The frontend places.json may have:
       *
       * googlePlaceId: ""
       *
       * The database record is the source of truth.
       *
       * Placemap will load the MongoDB place.
       */


      console.log(
        "🗺️ Opening Google navigation..."
      );


      /* =================================================
         CLOSE MODAL
      ================================================= */

      setSelectedPlace(
        null
      );


      /* =================================================
         OPEN MAP PAGE
      ================================================= */

      navigate(
        `/places/${resolved._id}/map`
      );

    } catch (error) {

      console.error(
        "❌ Place resolution error:",
        error
      );


      alert(
        error?.message ||
        "Unable to load place."
      );

    } finally {

      setResolvingPlaceId(
        null
      );

    }

  };


  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {

    setSelectedPlace(
      null
    );

  };


  /* =====================================================
     OPEN DETAILS
  ===================================================== */

  const openDetails = (
    place
  ) => {

    setSelectedPlace(
      place
    );


    /*
     * We no longer use localStorage.
     *
     * MongoDB is the source of truth.
     */

    setAddedPlaceId(
      null
    );

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div
      className="
                min-h-screen
                bg-gradient-to-b
                from-[#f6faf8]
                via-white
                to-white
                text-slate-800
            "
    >

      {/* =================================================
                PAGE HEADER
            ================================================= */}

      <section
        className="
                    mx-auto
                    max-w-[1400px]
                    px-5
                    pb-8
                    pt-10
                    md:px-10
                    lg:pt-14
                "
      >

        <div
          className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-bold
                        tracking-[0.18em]
                        text-emerald-700
                    "
        >

          <span
            className="
                            h-[3px]
                            w-8
                            rounded-full
                            bg-emerald-700
                        "
          />

          DISCOVER

        </div>


        <div
          className="
                        mt-3
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
        >

          <div>

            <h1
              className="
                                text-4xl
                                font-extrabold
                                tracking-tight
                                text-[#073b3a]
                                sm:text-5xl
                            "
            >
              Explore Bharatpur
            </h1>


            <p
              className="
                                mt-3
                                max-w-2xl
                                text-base
                                leading-7
                                text-slate-500
                            "
            >
              Find destinations, food, stays,
              events, and local experiences.
            </p>

          </div>


          <div
            className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-emerald-100
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-emerald-700
                            shadow-sm
                            md:flex
                        "
          >

            <Sparkles
              size={16}
            />

            Discover something new

          </div>

        </div>


        {/* SEARCH */}

        <div
          className="
                        mt-8
                        flex
                        gap-3
                    "
        >

          <div
            className="
                            relative
                            flex-1
                        "
          >

            <Search
              size={21}
              className="
                                absolute
                                left-5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
            />


            <input
              type="text"
              value={search}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder="
                                Search destinations, experiences, restaurants...
                            "
              className="
                                h-16
                                w-full
                                rounded-2xl
                                border
                                border-slate-100
                                bg-white
                                pl-14
                                pr-5
                                text-sm
                                text-slate-800
                                shadow-sm
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-emerald-300
                                focus:ring-4
                                focus:ring-emerald-50
                            "
            />

          </div>


          <button
            type="button"
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
            className="
                            flex
                            h-16
                            w-16
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-600
                            shadow-sm
                            transition
                            hover:border-emerald-300
                            hover:text-emerald-700
                            md:hidden
                        "
          >

            <SlidersHorizontal
              size={21}
            />

          </button>

        </div>


        {/* CATEGORY FILTERS */}

        <div
          className={`
                        mt-6
                        flex
                        flex-wrap
                        gap-3
                        ${showFilters
              ? "flex"
              : "hidden md:flex"
            }
                    `}
        >

          {categories.map(
            (category) => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    category
                  )
                }
                className={`
                                    rounded-full
                                    border
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    transition

                                    ${activeCategory ===
                    category
                    ? `
                                                border-emerald-700
                                                bg-emerald-700
                                                text-white
                                                shadow-md
                                            `
                    : `
                                                border-slate-200
                                                bg-white
                                                text-slate-700
                                                hover:border-emerald-300
                                                hover:bg-emerald-50
                                                hover:text-emerald-700
                                            `
                  }
                                `}
              >
                {category}
              </button>

            )
          )}

        </div>

      </section>


      {/* =================================================
                RESULTS
            ================================================= */}

      <main
        className="
                    mx-auto
                    max-w-[1400px]
                    px-5
                    pb-20
                    md:px-10
                "
      >

        <div
          className="
                        mb-6
                        flex
                        items-center
                        justify-between
                    "
        >

          <div>

            <h2
              className="
                                text-2xl
                                font-extrabold
                                text-[#073b3a]
                                sm:text-3xl
                            "
            >
              Recommended for you
            </h2>


            <p
              className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
            >
              {filteredPlaces.length}{" "}
              {
                filteredPlaces.length === 1
                  ? "place"
                  : "places"
              }{" "}
              found
            </p>

          </div>


          {activeCategory !==
            "All" && (

              <div
                className="
                                hidden
                                rounded-full
                                bg-emerald-50
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-emerald-700
                                sm:block
                            "
              >
                {activeCategory}
              </div>

            )}

        </div>


        {/* NO RESULTS */}

        {filteredPlaces.length ===
          0 ? (

          <div
            className="
                            flex
                            min-h-[350px]
                            flex-col
                            items-center
                            justify-center
                            rounded-[28px]
                            border
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            px-5
                            text-center
                        "
          >

            <div
              className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-full
                                bg-emerald-100
                                text-emerald-700
                            "
            >

              <Search
                size={27}
              />

            </div>


            <h3
              className="
                                mt-5
                                text-xl
                                font-bold
                                text-slate-800
                            "
            >
              No places found
            </h3>


            <p
              className="
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-slate-500
                            "
            >
              Try searching for another
              destination or choose a
              different category.
            </p>


            <button
              type="button"
              onClick={
                clearFilters
              }
              className="
                                mt-5
                                rounded-full
                                bg-emerald-700
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-white
                                hover:bg-emerald-800
                            "
            >
              Clear filters
            </button>

          </div>

        ) : (

          /* PLACE GRID */

          <div
            className="
                            grid
                            grid-cols-1
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                        "
          >

            {filteredPlaces.map(
              (place) => (

                <article
                  key={place.id}
                  className="
                                        group
                                        overflow-hidden
                                        rounded-[22px]
                                        border
                                        border-slate-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-xl
                                    "
                >

                  <div
                    className="
                                            relative
                                            h-[220px]
                                            overflow-hidden
                                        "
                  >

                    <img
                      src={
                        place.image
                      }
                      alt={
                        place.name
                      }
                      className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition
                                                duration-500
                                                group-hover:scale-105
                                            "
                    />


                    <div
                      className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-t
                                                from-black/45
                                                via-transparent
                                                to-transparent
                                            "
                    />


                    <div
                      className="
                                                absolute
                                                left-4
                                                top-4
                                                rounded-full
                                                bg-white/95
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                text-emerald-800
                                                shadow-sm
                                            "
                    >
                      {
                        place
                          .category?.[0]
                      }
                    </div>


                    <div
                      className="
                                                absolute
                                                bottom-4
                                                right-4
                                                flex
                                                items-center
                                                gap-1
                                                rounded-full
                                                bg-white
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                text-slate-800
                                                shadow-sm
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

                    </div>

                  </div>


                  <div
                    className="
                                            p-5
                                        "
                  >

                    <h3
                      className="
                                                line-clamp-1
                                                text-lg
                                                font-extrabold
                                                text-slate-900
                                            "
                    >
                      {place.name}
                    </h3>


                    <div
                      className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-1.5
                                                text-sm
                                                text-slate-500
                                            "
                    >

                      <MapPin
                        size={15}
                        className="
                                                    shrink-0
                                                    text-emerald-700
                                                "
                      />


                      <span
                        className="
                                                    line-clamp-1
                                                "
                      >
                        {place.location}
                      </span>

                    </div>


                    <p
                      className="
                                                mt-3
                                                line-clamp-2
                                                min-h-[48px]
                                                text-sm
                                                leading-6
                                                text-slate-500
                                            "
                    >
                      {
                        place.description
                      }
                    </p>


                    <div
                      className="
                                                mt-4
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                    >

                      {place.category
                        ?.slice(
                          0,
                          2
                        )
                        .map(
                          (
                            category
                          ) => (

                            <span
                              key={
                                category
                              }
                              className="
                                                                rounded-full
                                                                bg-slate-100
                                                                px-3
                                                                py-1
                                                                text-[11px]
                                                                font-semibold
                                                                text-slate-600
                                                            "
                            >
                              {
                                category
                              }
                            </span>

                          )
                        )}

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        openDetails(
                          place
                        )
                      }
                      className="
                                                mt-5
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-full
                                                border
                                                border-slate-200
                                                bg-white
                                                px-4
                                                py-3
                                                text-sm
                                                font-bold
                                                text-slate-800
                                                transition
                                                hover:border-emerald-600
                                                hover:bg-emerald-50
                                                hover:text-emerald-700
                                            "
                    >

                      View Details

                      <ArrowRight
                        size={16}
                      />

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>


      {/* =========================================================
                DESTINATION MODAL
            ========================================================= */}

      {selectedPlace && (

        <div
          className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-slate-950/60
                        p-4
                        backdrop-blur-sm
                    "
          onClick={
            closeModal
          }
        >

          <div
            className="
                            relative
                            max-h-[92vh]
                            w-full
                            max-w-5xl
                            overflow-y-auto
                            rounded-[28px]
                            bg-white
                            shadow-2xl
                        "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              onClick={
                closeModal
              }
              className="
                                absolute
                                right-5
                                top-5
                                z-20
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-white/95
                                text-slate-600
                                shadow-lg
                                transition
                                hover:bg-slate-100
                            "
            >

              <X
                size={20}
              />

            </button>


            <div
              className="
                                grid
                                grid-cols-1
                                lg:grid-cols-2
                            "
            >

              {/* LEFT IMAGE */}

              <div
                className="
                                    relative
                                    min-h-[300px]
                                    lg:min-h-[620px]
                                "
              >

                <img
                  src={
                    selectedPlace.image
                  }
                  alt={
                    selectedPlace.name
                  }
                  className="
                                        absolute
                                        inset-0
                                        h-full
                                        w-full
                                        object-cover
                                    "
                />


                <div
                  className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/65
                                        via-black/10
                                        to-transparent
                                    "
                />


                <div
                  className="
                                        absolute
                                        bottom-7
                                        left-6
                                        right-6
                                        text-white
                                        sm:left-8
                                        sm:right-8
                                    "
                >

                  <div
                    className="
                                            mb-3
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                  >

                    {selectedPlace
                      .category
                      ?.map(
                        (
                          category
                        ) => (

                          <span
                            key={
                              category
                            }
                            className="
                                                            rounded-full
                                                            bg-white/20
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            backdrop-blur-md
                                                        "
                          >
                            {
                              category
                            }
                          </span>

                        )
                      )}

                  </div>


                  <h2
                    className="
                                            text-3xl
                                            font-extrabold
                                            sm:text-4xl
                                        "
                  >
                    {
                      selectedPlace.name
                    }
                  </h2>


                  <div
                    className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-white/90
                                        "
                  >

                    <MapPin
                      size={17}
                    />

                    {
                      selectedPlace.location
                    }

                  </div>

                </div>

              </div>


              {/* RIGHT DETAILS */}

              <div
                className="
                                    p-6
                                    sm:p-8
                                    lg:p-10
                                "
              >

                <div
                  className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                >

                  <div>

                    <p
                      className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.16em]
                                                text-emerald-700
                                            "
                    >
                      Destination Details
                    </p>


                    <h3
                      className="
                                                mt-2
                                                text-2xl
                                                font-extrabold
                                                text-slate-900
                                            "
                    >
                      Plan your visit
                    </h3>

                  </div>


                  <div
                    className="
                                            flex
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            bg-amber-50
                                            px-3
                                            py-2
                                            text-sm
                                            font-bold
                                            text-slate-800
                                        "
                  >

                    <Star
                      size={15}
                      className="
                                                fill-amber-400
                                                text-amber-400
                                            "
                    />

                    {
                      selectedPlace.rating
                    }

                  </div>

                </div>


                <p
                  className="
                                        mt-6
                                        text-sm
                                        leading-7
                                        text-slate-600
                                    "
                >
                  {
                    selectedPlace.description
                  }
                </p>


                <div
                  className="
                                        mt-7
                                        space-y-5
                                    "
                >

                  <div>

                    <p
                      className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                    >
                      Best For
                    </p>

                    <p
                      className="
                                                mt-1
                                                font-bold
                                                text-slate-800
                                            "
                    >
                      {
                        selectedPlace
                          .details
                          ?.bestFor ||
                        "Everyone"
                      }
                    </p>

                  </div>


                  <div>

                    <p
                      className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                    >
                      Suggested Time
                    </p>

                    <p
                      className="
                                                mt-1
                                                font-bold
                                                text-slate-800
                                            "
                    >
                      {
                        selectedPlace
                          .details
                          ?.suggestedTime ||
                        "2–4 hours"
                      }
                    </p>

                  </div>


                  <div>

                    <p
                      className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                    >
                      Cost
                    </p>

                    <p
                      className="
                                                mt-1
                                                font-bold
                                                text-slate-800
                                            "
                    >
                      {
                        selectedPlace
                          .details
                          ?.cost ||
                        "Check current local fees"
                      }
                    </p>

                  </div>


                  <div>

                    <p
                      className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                    >
                      Nearby
                    </p>

                    <p
                      className="
                                                mt-1
                                                font-bold
                                                text-slate-800
                                            "
                    >
                      {
                        selectedPlace
                          .details
                          ?.nearby ||
                        "Food • Hotels • Attractions"
                      }
                    </p>

                  </div>

                </div>


                <div
                  className="
                                        mt-7
                                        flex
                                        items-center
                                        gap-2
                                        border-t
                                        border-slate-100
                                        pt-6
                                    "
                >

                  <Star
                    size={17}
                    className="
                                            fill-amber-400
                                            text-amber-400
                                        "
                  />


                  <span
                    className="
                                            text-sm
                                            font-bold
                                            text-slate-800
                                        "
                  >
                    {
                      selectedPlace.rating
                    }
                  </span>


                  <span
                    className="
                                            text-sm
                                            text-slate-400
                                        "
                  >
                    •
                  </span>


                  <span
                    className="
                                            text-sm
                                            text-slate-500
                                        "
                  >
                    {
                      selectedPlace.reviews ||
                      0
                    }{" "}
                    reviews
                  </span>

                </div>


                {/* ACTION BUTTONS */}

                <div
                  className="
                                        mt-7
                                        grid
                                        grid-cols-1
                                        gap-3
                                        sm:grid-cols-2
                                    "
                >

                  {/* ADD TO TRIP */}

                  <button
                    type="button"
                    onClick={() =>
                      addToMyTrip(
                        selectedPlace
                      )
                    }
                    disabled={
                      addingPlaceId ===
                      selectedPlace.id
                    }
                    className={`
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-full
                                            px-5
                                            py-3.5
                                            text-sm
                                            font-bold
                                            transition

                                            ${addedPlaceId ===
                        selectedPlace.id
                        ? `
                                                        bg-emerald-100
                                                        text-emerald-800
                                                    `
                        : `
                                                        bg-emerald-700
                                                        text-white
                                                        shadow-lg
                                                        shadow-emerald-700/20
                                                        hover:bg-emerald-800
                                                    `
                      }

                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        `}
                  >

                    {addingPlaceId ===
                      selectedPlace.id ? (

                      <>

                        <RefreshCw
                          size={18}
                          className="
                                                        animate-spin
                                                    "
                        />

                        Saving...

                      </>

                    ) : addedPlaceId ===
                      selectedPlace.id ? (

                      <>

                        <Check
                          size={18}
                        />

                        Added to My Trip

                      </>

                    ) : (

                      <>

                        <Plus
                          size={18}
                        />

                        Add to My Trip

                      </>

                    )}

                  </button>


                  {/* ASK AI */}

                  <button
                    type="button"
                    onClick={() => {

                      navigate(
                        "/ai-guides"
                      );

                    }}
                    className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-slate-200
                                            bg-white
                                            px-5
                                            py-3.5
                                            text-sm
                                            font-bold
                                            text-slate-800
                                            transition
                                            hover:border-emerald-500
                                            hover:bg-emerald-50
                                            hover:text-emerald-700
                                        "
                  >

                    <Sparkles
                      size={17}
                    />

                    Ask AI About This Place

                  </button>


                  {/* DIRECTIONS */}

                  <button
                    type="button"
                    onClick={() =>
                      openDirections(
                        selectedPlace
                      )
                    }
                    disabled={
                      resolvingPlaceId ===
                      selectedPlace.id
                    }
                    className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-emerald-200
                                            bg-emerald-50
                                            px-5
                                            py-3.5
                                            text-sm
                                            font-bold
                                            text-emerald-800
                                            transition
                                            hover:bg-emerald-700
                                            hover:text-white
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                  >

                    {resolvingPlaceId ===
                      selectedPlace.id ? (

                      <>

                        <RefreshCw
                          size={18}
                          className="
                                                        animate-spin
                                                    "
                        />

                        Preparing destination...

                      </>

                    ) : (

                      <>

                        <Navigation
                          size={18}
                        />

                        Directions

                      </>

                    )}

                  </button>

                </div>


                {/* REVIEW */}

                {selectedPlace
                  .details
                  ?.review && (

                    <div
                      className="
                                            mt-7
                                            rounded-2xl
                                            bg-slate-50
                                            p-5
                                        "
                    >

                      <p
                        className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                            "
                      >
                        Visitor Review
                      </p>


                      <p
                        className="
                                                mt-2
                                                text-sm
                                                italic
                                                leading-6
                                                text-slate-600
                                            "
                      >
                        "
                        {
                          selectedPlace
                            .details
                            .review
                        }
                        "
                      </p>

                    </div>

                  )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default Explore;