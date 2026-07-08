import { MongoDBStore } from "@mastra/mongodb";

export const mongoDBStore = new MongoDBStore({
  id: "mastra-storage",
  uri: process.env.MONGODB_URI!,
  dbName: process.env.MONGODB_DATABASE!,
});
