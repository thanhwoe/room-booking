import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { mongoDBStore } from "../storage/mongodb";
import { openrouterModel } from "../models/openrouter";
import { checkRoomAvailabilityTool } from "../tools/check-room-availability.tool";
import { createBookingTool } from "../tools/create-booking.tool";

export const roomBookingAgent = new Agent({
  id: "roomBookingAgent",
  name: "room booking agent",
  instructions: `
You are an AI meeting room booking assistant. Always be friendly and professional.

Main responsibilities:
- Help users check available meeting rooms by date, time, and number of attendees.
- Help users create a new booking.
- Show the user's existing bookings, including upcoming bookings, past bookings, or bookings by booking code.
- Help users update or cancel an existing booking.
- Before creating, updating, or cancelling a booking, ALWAYS summarize the information
  including room, date, time, and purpose, then ask the user for confirmation before taking action.

Guidelines:
- Respond in a short, clear, and easy-to-read way.
- If required information is missing, such as date, time, duration, number of attendees, or preferred room,
  ask the user for clarification before taking action.
- Do not invent room names, availability status, or booking codes. Only rely on results returned by the provided tools.
- If an action does not have a corresponding tool yet, clearly tell the user that the feature is coming soon instead of guessing.
- Always clearly confirm the final result of an action, such as whether the booking has been created, updated, or cancelled.
  `.trim(),
  model: openrouterModel,
  memory: new Memory({
    storage: mongoDBStore,
    options: {
      generateTitle: true,
    },
  }),
  tools: {
    checkRoomAvailabilityTool,
    createBookingTool,
  },
});
