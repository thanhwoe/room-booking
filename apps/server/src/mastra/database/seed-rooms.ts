import "dotenv/config";
import { getRoomsCollection } from "./collections/room.collection";

const sampleRooms = [
  {
    name: "Sunflower",
    capacity: 4,
    location: "Floor 3",
    amenities: ["TV screen", "Whiteboard"],
  },
  {
    name: "Orchid",
    capacity: 8,
    location: "Floor 3",
    amenities: ["Projector", "Video conferencing"],
  },
  {
    name: "Lotus",
    capacity: 12,
    location: "Floor 5",
    amenities: ["Projector", "Video conferencing", "Whiteboard"],
  },
  {
    name: "Bamboo",
    capacity: 2,
    location: "Floor 2",
    amenities: ["TV screen"],
  },
];

async function seed() {
  const roomsCollection = await getRoomsCollection();

  const existingCount = await roomsCollection.countDocuments();
  if (existingCount > 0) {
    console.log(
      `Rooms collection already has ${existingCount} document(s). Skipping seed.`,
    );
    process.exit(0);
  }

  const result = await roomsCollection.insertMany(sampleRooms);
  console.log(`Inserted ${result.insertedCount} room(s).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
