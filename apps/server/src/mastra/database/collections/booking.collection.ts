import { Collection, ObjectId } from "mongodb";
import { getDb } from "../mongodb";

export interface BookingDocument {
  _id?: ObjectId;
  roomId: string;
  roomName: string;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export async function getBookingsCollection(): Promise<
  Collection<BookingDocument>
> {
  const db = await getDb();
  return db.collection<BookingDocument>("bookings");
}
