import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getBookingsCollection } from "../database/collections/booking.collection";

export const listBookingsTool = createTool({
  id: "list-bookings",
  description:
    "List existing room bookings for a given organizer. Can filter by status (confirmed/cancelled) and by a time range. Use this when the user asks to see their bookings, or before updating/cancelling a booking.",
  inputSchema: z.object({
    organizer: z.string().describe("Name of the person who made the bookings"),
    status: z
      .enum(["confirmed", "cancelled", "all"])
      .default("confirmed")
      .describe("Filter by booking status"),
    fromTime: z
      .string()
      .optional()
      .describe(
        "Only return bookings starting at or after this ISO 8601 timestamp",
      ),
    toTime: z
      .string()
      .optional()
      .describe(
        "Only return bookings starting at or before this ISO 8601 timestamp",
      ),
  }),
  outputSchema: z.object({
    bookings: z.array(
      z.object({
        id: z.string(),
        roomId: z.string(),
        roomName: z.string(),
        title: z.string(),
        organizer: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        attendees: z.number(),
        status: z.enum(["confirmed", "cancelled"]),
      }),
    ),
  }),
  execute: async (inputData) => {
    const { organizer, status, fromTime, toTime } = inputData;

    const bookingsCollection = await getBookingsCollection();

    const filter: Record<string, unknown> = { organizer };
    if (status !== "all") {
      filter.status = status;
    }
    if (fromTime || toTime) {
      filter.startTime = {
        ...(fromTime ? { $gte: fromTime } : {}),
        ...(toTime ? { $lte: toTime } : {}),
      };
    }

    const bookings = await bookingsCollection
      .find(filter)
      .sort({ startTime: 1 })
      .toArray();

    return {
      bookings: bookings.map((b) => ({
        id: String(b._id),
        roomId: b.roomId,
        roomName: b.roomName,
        title: b.title,
        organizer: b.organizer,
        startTime: b.startTime,
        endTime: b.endTime,
        attendees: b.attendees,
        status: b.status,
      })),
    };
  },
});
