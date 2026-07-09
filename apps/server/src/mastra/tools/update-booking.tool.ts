import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getBookingsCollection } from "../database/collections/booking.collection";
import { getRoomsCollection } from "../database/collections/room.collection";

export const updateBookingTool = createTool({
  id: "update-booking",
  description:
    "Update an existing confirmed booking's time and/or attendee count. Only call this AFTER the user has approved the change via the confirmBookingChange confirmation step.",
  inputSchema: z.object({
    bookingId: z.string().describe("The id of the booking to update"),
    startTime: z.string().optional().describe("New start time, ISO 8601"),
    endTime: z.string().optional().describe("New end time, ISO 8601"),
    attendees: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("New attendee count"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async (inputData) => {
    const { bookingId, startTime, endTime, attendees } = inputData;

    let bookingObjectId: ObjectId;
    try {
      bookingObjectId = new ObjectId(bookingId);
    } catch {
      return { success: false, message: `Invalid bookingId: "${bookingId}".` };
    }

    const bookingsCollection = await getBookingsCollection();
    const roomsCollection = await getRoomsCollection();

    const booking = await bookingsCollection.findOne({ _id: bookingObjectId });
    if (!booking) {
      return {
        success: false,
        message: `Booking with id "${bookingId}" was not found.`,
      };
    }
    if (booking.status === "cancelled") {
      return {
        success: false,
        message:
          "This booking has already been cancelled and cannot be updated.",
      };
    }

    const newStart = startTime
      ? new Date(startTime)
      : new Date(booking.startTime);
    const newEnd = endTime ? new Date(endTime) : new Date(booking.endTime);
    const newAttendees = attendees ?? booking.attendees;

    if (
      Number.isNaN(newStart.getTime()) ||
      Number.isNaN(newEnd.getTime()) ||
      newStart >= newEnd
    ) {
      return {
        success: false,
        message:
          "Invalid time range: startTime must be a valid date before endTime.",
      };
    }

    const room = await roomsCollection.findOne({
      _id: new ObjectId(booking.roomId),
    });
    if (room && newAttendees > room.capacity) {
      return {
        success: false,
        message: `${room.name} only fits ${room.capacity} people, but ${newAttendees} attendees were requested.`,
      };
    }

    const conflict = await bookingsCollection.findOne({
      _id: { $ne: bookingObjectId },
      roomId: booking.roomId,
      status: "confirmed",
      startTime: { $lt: newEnd.toISOString() },
      endTime: { $gt: newStart.toISOString() },
    });

    if (conflict) {
      return {
        success: false,
        message: `${booking.roomName} is not available for the new time slot. Please choose another time.`,
      };
    }

    await bookingsCollection.updateOne(
      { _id: bookingObjectId },
      {
        $set: {
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
          attendees: newAttendees,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return {
      success: true,
      message: `Booking for "${booking.title}" updated to ${newStart.toISOString()} - ${newEnd.toISOString()}.`,
    };
  },
});
