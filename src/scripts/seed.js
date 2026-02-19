// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Property from "../models/Property.js";
// import properties from "@/data/seedData.js";

// dotenv.config({ path: ".env.local" });
// console.log("MONGO_URI:", process.env.MONGO_URI);
// const seedData = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     await Property.deleteMany();
//     console.log("🗑 Existing properties removed");

//     await Property.insertMany(properties);
//     console.log("✅ Properties seeded successfully");

//     process.exit();
//   } catch (error) {
//     console.error("❌ Seeding failed:", error);
//     process.exit(1);
//   }
// };

// seedData();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/User.js";
import AgentProfile from "../models/AgentProfile.js";
import Property from "../models/Property.js";
import Lead from "../models/Lead.js";
import Notification from "../models/Notification.js";

dotenv.config();

/* -------------------- */
/* DB CONNECTION       */
/* -------------------- */
async function connectDB() {
  if (mongoose.connection.readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
}

/* -------------------- */
/* CLEAN DATABASE      */
/* -------------------- */
async function clearDB() {
  await Promise.all([
    User.deleteMany(),
    AgentProfile.deleteMany(),
    Property.deleteMany(),
    Lead.deleteMany(),
    Notification.deleteMany(),
  ]);
  console.log("🧹 Database cleared");
}

/* -------------------- */
/* SEED DATA           */
/* -------------------- */
async function seed() {
  await connectDB();
  await clearDB();

  const password = await bcrypt.hash("123456", 10);

  /* ---------- USERS ---------- */
  const users = await User.insertMany([
    {
      name: "Rahul Verma",
      email: "rahul.user@gmail.com",
      password,
      role: "user",
      propertiesPosted: 1,
    },
    {
      name: "Anjali Singh",
      email: "anjali.user@gmail.com",
      password,
      role: "user",
      propertiesPosted: 0,
    },
    {
      name: "Rahul Sharma",
      email: "rahul.agent@gmail.com",
      password,
      role: "agent",
    },
    {
      name: "Suresh Patil",
      email: "suresh.agent@gmail.com",
      password,
      role: "agent",
    },
    {
      name: "Admin One",
      email: "admin@irealestate.com",
      password,
      role: "admin",
    },
  ]);

  const [user1, user2, agentUser1, agentUser2, admin] = users;

  /* ---------- AGENTS ---------- */
  const agents = await AgentProfile.insertMany([
    {
      user: agentUser1._id,
      designation: "Senior Property Consultant",
      phone: "9876543210",
      experience: 6,
      rating: 4.8,
      totalLeads: 124,
      city: "Bangalore",
      verified: true,
    },
    {
      user: agentUser2._id,
      designation: "Real Estate Advisor",
      phone: "9123456780",
      experience: 4,
      rating: 4.5,
      totalLeads: 86,
      city: "Pune",
      verified: true,
    },
  ]);

  const [agent1, agent2] = agents;

  /* ---------- PROPERTIES ---------- */
const properties = await Property.insertMany([
  {
    title: "3 BHK Luxury Apartment in Indiranagar",
    description:
      "Premium apartment with Italian marble, clubhouse & sky lounge.",
    listingType: "sale",
    propertyType: "apartment",
    priceLabel: "₹ 1.5 Cr",
    priceValue: 15000000,
    city: "Bangalore",
    state: "Karnataka",
    address: "100 Feet Road, Indiranagar",
    beds: 3,
    baths: 3,
    areaSqFt: 1850,
    furnishing: "semi",
    amenities: ["pool", "gym", "parking", "security", "lift"],
    images: ["https://images.unsplash.com/photo-1502673530728-f79b4cab31b1"],

    owner: agentUser1._id,   // ✅ REQUIRED
    agent: agent1._id,       // ✅ OPTIONAL BUT IMPORTANT
  },

  {
    title: "4 BHK Independent Villa with Garden",
    description: "Spacious villa with private garden and terrace.",
    listingType: "sale",
    propertyType: "villa",
    priceLabel: "₹ 3.2 Cr",
    priceValue: 32000000,
    city: "Bangalore",
    state: "Karnataka",
    address: "Whitefield Main Road",
    beds: 4,
    baths: 4,
    areaSqFt: 4200,
    furnishing: "full",
    amenities: ["garden", "parking", "security"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],

    owner: agentUser1._id,
    agent: agent1._id,
  },

  {
    title: "Fully Furnished IT Office Space",
    description: "Plug & play office inside Hinjewadi IT Park.",
    listingType: "rent",
    propertyType: "office",
    priceLabel: "₹ 2.5 L / month",
    priceValue: 250000,
    city: "Pune",
    state: "Maharashtra",
    address: "Hinjewadi Phase 2",
    beds: 0,
    baths: 2,
    areaSqFt: 3200,
    furnishing: "full",
    amenities: ["parking", "power backup", "security"],
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c"],

    owner: agentUser2._id,
    agent: agent2._id,
  },

  {
    title: "2 BHK Affordable Apartment",
    description: "Ideal for first-time buyers, close to metro.",
    listingType: "sale",
    propertyType: "apartment",
    priceLabel: "₹ 68 Lakhs",
    priceValue: 6800000,
    city: "Hyderabad",
    state: "Telangana",
    address: "Miyapur Metro Station",
    beds: 2,
    baths: 2,
    areaSqFt: 1150,
    furnishing: "semi",
    amenities: ["lift", "parking"],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],

    owner: user1._id,   // 👤 user listed property
    agent: null,
  },

  {
    title: "2 BHK Rental Apartment in Bandra West",
    description: "Prime location near cafes and sea link.",
    listingType: "rent",
    propertyType: "apartment",
    priceLabel: "₹ 85,000 / month",
    priceValue: 85000,
    city: "Mumbai",
    state: "Maharashtra",
    address: "Bandra West",
    beds: 2,
    baths: 2,
    areaSqFt: 950,
    furnishing: "full",
    amenities: ["security", "lift"],
    images: ["https://images.unsplash.com/photo-1494526585095-c41746248156"],

    owner: user2._id,
    agent: agent2._id,
  },

  {
    title: "Residential Plot Near ORR",
    description: "Clear title residential plot suitable for villa.",
    listingType: "sale",
    propertyType: "plot",
    priceLabel: "₹ 95 Lakhs",
    priceValue: 9500000,
    city: "Bangalore",
    state: "Karnataka",
    address: "Sarjapur Road",
    beds: 0,
    baths: 0,
    areaSqFt: 2400,
    furnishing: "none",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],

    owner: user1._id,
    agent: agent1._id,
  },
]);


  /* ---------- LEADS ---------- */
  await Lead.insertMany([
    {
      user: user1._id,
      property: properties[0]._id,
      agent: agent1._id,
      message: "I am interested in visiting this property",
      status: "new",
    },
    {
      user: user2._id,
      property: properties[1]._id,
      agent: agent2._id,
      message: "Is it available immediately?",
      status: "contacted",
    },
  ]);

  /* ---------- NOTIFICATIONS ---------- */
  await Notification.insertMany([
    {
      user: user1._id,
      type: "lead",
      message: "Agent contacted you for your enquiry",
    },
    {
      user: agent1._id,
      type: "new_property",
      message: "New property listed in Bangalore",
    },
  ]);

  console.log("🌱 Database seeded successfully");
  process.exit();
}

seed().catch((err) => {
  console.error("❌ Seeder failed", err);
  process.exit(1);
});
