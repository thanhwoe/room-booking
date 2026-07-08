import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getRoomsCollection } from "../database/collections/room.collection";
import { getBookingsCollection } from "../database/collections/booking.collection";

export const checkRoomAvailabilityTool = createTool({
  id: "check-room-availability",
  description:
    "Check which meeting rooms are available for a given time range and minimum capacity. Returns a list of available rooms with their details, to be used before creating a booking.",
  inputSchema: z.object({
    startTime: z
      .string()
      .describe(
        "Start of the requested time range, ISO 8601 (e.g. 2026-07-10T09:00:00.000Z)",
      ),
    endTime: z
      .string()
      .describe(
        "End of the requested time range, ISO 8601 (e.g. 2026-07-10T10:00:00.000Z)",
      ),
    minCapacity: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Minimum number of people the room must fit"),
  }),
  outputSchema: z.object({
    availableRooms: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        capacity: z.number(),
        location: z.string().optional(),
        amenities: z.array(z.string()),
      }),
    ),
  }),
  execute: async (inputData) => {
    const { startTime, endTime, minCapacity } = inputData;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error(
        "startTime and endTime must be valid ISO 8601 date strings",
      );
    }
    if (start >= end) {
      throw new Error("startTime must be before endTime");
    }

    const roomsCollection = await getRoomsCollection();
    const bookingsCollection = await getBookingsCollection();

    const roomFilter = minCapacity ? { capacity: { $gte: minCapacity } } : {};
    const rooms = await roomsCollection.find(roomFilter).toArray();

    const overlappingBookings = await bookingsCollection
      .find({
        status: "confirmed",
        startTime: { $lt: end.toISOString() },
        endTime: { $gt: start.toISOString() },
      })
      .toArray();

    const bookedRoomIds = new Set(overlappingBookings.map((b) => b.roomId));

    const availableRooms = rooms
      .filter((room) => !bookedRoomIds.has(String(room._id)))
      .map((room) => ({
        id: String(room._id),
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        amenities: room.amenities ?? [],
      }));

    return { availableRooms };
  },
});
