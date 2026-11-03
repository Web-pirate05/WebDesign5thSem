/* Event data. Dates are generated relative to today (days from now, 24h time)
   so the demo never shows expired events. Replace with fixed ISO dates if you prefer. */
const at = (days, time) => {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(+h, +m, 0, 0);
  return d.toISOString();
};

const CATS = { Tech: "💻", Music: "🎵", Art: "🎨", Sports: "🏃", Business: "💼", Food: "🍜" };

const EVENTS = [
  { id: 1, name: "Neon Nights Music Festival", category: "Music", date: at(9, "18:00"), venue: "Skyline Arena, Mumbai", price: 799, seats: 500, featured: true, seed: "neon-music",
    desc: "Eight live acts, one open-air stage and a light show that runs until midnight.",
    about: "Neon Nights brings eight indie, electronic and fusion acts to a single open-air stage. Expect food stalls, a silent-disco tent and a closing light show. Gates open two hours before the first act." },
  { id: 2, name: "DevSphere Hackathon 2026", category: "Tech", date: at(5, "09:00"), venue: "Innovation Hub, Bengaluru", price: 0, seats: 200, featured: true, seed: "dev-hackathon",
    desc: "A 24-hour build sprint with mentors, free meals and prizes for the top teams.",
    about: "Form a team of up to four and build a working prototype in 24 hours. Mentors from product companies review ideas through the night, and the top three teams win cash prizes and internship interviews." },
  { id: 3, name: "Canvas & Colors Art Expo", category: "Art", date: at(14, "11:00"), venue: "City Art Gallery, Delhi", price: 150, seats: 300, seed: "art-expo",
    desc: "Over 60 emerging artists show paintings, sculpture and digital work.",
    about: "Walk through six themed halls, meet the artists and join live painting sessions. Original works are on sale, and a student corner lets visitors try printmaking for free." },
  { id: 4, name: "Startup Pitch Summit", category: "Business", date: at(21, "10:00"), venue: "Grand Convention Hall, Hyderabad", price: 499, seats: 250, featured: true, seed: "startup-pitch",
    desc: "Twenty early-stage founders pitch to a panel of investors, live.",
    about: "Watch twenty founders pitch in five-minute slots, followed by investor Q&A. A networking lunch and a demo floor give attendees time to meet the teams one-to-one." },
  { id: 5, name: "City Marathon 10K", category: "Sports", date: at(30, "05:30"), venue: "Marine Drive, Chennai", price: 300, seats: 1000, seed: "city-marathon",
    desc: "A flat, fast 10K along the seafront with timing chips and finisher medals.",
    about: "Start at sunrise on a closed, flat route. Every runner gets a timing chip, hydration points every 2 km, a finisher medal and a breakfast pack at the finish line." },
  { id: 6, name: "Street Food Carnival", category: "Food", date: at(12, "12:00"), venue: "Riverfront Park, Kolkata", price: 100, seats: 800, seed: "street-food",
    desc: "More than 40 stalls serving regional street food, desserts and drinks.",
    about: "Sample dishes from across India at 40 stalls, watch live cooking demos and vote for your favourite stall. Entry includes five tasting coupons." },
  { id: 7, name: "AI & Future Tech Conference", category: "Tech", date: at(40, "09:30"), venue: "Tech Park Auditorium, Pune", price: 999, seats: 400, seed: "ai-conference",
    desc: "Two days of talks and workshops on applied AI, robotics and cloud.",
    about: "Speakers from research labs and product teams cover applied machine learning, robotics and cloud architecture. Hands-on workshops run in parallel, and recordings are shared with all attendees." },
  { id: 8, name: "Indie Acoustic Evening", category: "Music", date: at(17, "19:00"), venue: "The Blue Room, Goa", price: 350, seats: 120, seed: "acoustic-night",
    desc: "An intimate set of original songs from four independent artists.",
    about: "A small room, four singer-songwriters and no amplifiers. Seating is limited to 120 so everyone is close to the stage. Drinks and snacks are available at the bar." },
  { id: 9, name: "Photography Masterclass", category: "Art", date: at(25, "14:00"), venue: "Studio 9, Jaipur", price: 600, seats: 40, seed: "photo-class",
    desc: "A hands-on session on light, composition and editing with a working photographer.",
    about: "Learn to read natural light, compose a frame and edit RAW files. Bring a camera or a phone; a shared studio set and editing laptops are provided. Seats are limited to 40." },
];
