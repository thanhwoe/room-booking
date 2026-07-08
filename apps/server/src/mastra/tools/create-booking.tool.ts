import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getRoomsCollection } from "../database/collections/room.collection";
import { getBookingsCollection } from "../database/collections/booking.collection";

export const createBookingTool = createTool({
  id: "create-booking",
  description:
    "Create a new room booking after the user has confirmed the details (room, date, time, purpose). Fails gracefully if the room is not available for the requested time.",
  inputSchema: z.object({
    roomId: z
      .string()
      .describe("The id of the room, as returned by check-room-availability"),
    title: z.string().describe("Short title or purpose of the meeting"),
    organizer: z.string().describe("Name of the person making the booking"),
    startTime: z.string().describe("Start time, ISO 8601"),
    endTime: z.string().describe("End time, ISO 8601"),
    attendees: z
      .number()
      .int()
      .positive()
      .default(1)
      .describe("Number of attendees"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    bookingId: z.string().optional(),
    message: z.string(),
  }),
  execute: async (inputData) => {
    const { roomId, title, organizer, startTime, endTime, attendees } =
      inputData;

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end
    ) {
      return {
        success: false,
        message:
          "Invalid time range: startTime must be a valid date before endTime.",
      };
    }

    let roomObjectId: ObjectId;
    try {
      roomObjectId = new ObjectId(roomId);
    } catch {
      return { success: false, message: `Invalid roomId: "${roomId}".` };
    }

    const roomsCollection = await getRoomsCollection();
    const bookingsCollection = await getBookingsCollection();

    const room = await roomsCollection.findOne({ _id: roomObjectId });
    if (!room) {
      return {
        success: false,
        message: `Room with id "${roomId}" was not found.`,
      };
    }

    if (attendees > room.capacity) {
      return {
        success: false,
        message: `${room.name} only fits ${room.capacity} people, but ${attendees} attendees were requested.`,
      };
    }

    const conflict = await bookingsCollection.findOne({
      roomId,
      status: "confirmed",
      startTime: { $lt: end.toISOString() },
      endTime: { $gt: start.toISOString() },
    });

    if (conflict) {
      return {
        success: false,
        message: `${room.name} is no longer available for that time slot. Please choose another room or time.`,
      };
    }

    const now = new Date().toISOString();

    const result = await bookingsCollection.insertOne({
      roomId,
      roomName: room.name,
      title,
      organizer,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      attendees,
      status: "confirmed",
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      bookingId: result.insertedId.toString(),
      message: `Booked "${room.name}" from ${start.toISOString()} to ${end.toISOString()} for "${title}".`,
    };
  },
});
