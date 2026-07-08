import { Collection, ObjectId } from "mongodb";
import { getDb } from "../mongodb";

export interface RoomDocument {
  _id?: ObjectId;
  name: string;
  capacity: number;
  location?: string;
  amenities: string[];
}

export async function getRoomsCollection(): Promise<Collection<RoomDocument>> {
  const db = await getDb();
  return db.collection<RoomDocument>("rooms");
}
