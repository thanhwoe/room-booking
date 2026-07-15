import {
  CalendarClockIcon,
  CalendarPlusIcon,
  ListChecksIcon,
  SearchIcon,
} from "lucide-react";
import { ElementType } from "react";

type Suggestion = {
  title: string;
  description: string;
  prompt: string;
  icon: ElementType;
};

export const SUGGESTIONS: Suggestion[] = [
  {
    title: "Find a room",
    description: "Search available rooms by time and capacity.",
    prompt: "Find an available room for 6 people tomorrow morning.",
    icon: SearchIcon,
  },
  {
    title: "Create booking",
    description: "Reserve a meeting room for your team.",
    prompt: "Book a meeting room for 5 people this Friday at 2 PM.",
    icon: CalendarPlusIcon,
  },
  {
    title: "Upcoming bookings",
    description: "Review your scheduled room reservations.",
    prompt: "Show me my upcoming room bookings.",
    icon: ListChecksIcon,
  },
  {
    title: "Update booking",
    description: "Change the time, room, or cancel a booking.",
    prompt: "Help me update or cancel an existing booking.",
    icon: CalendarClockIcon,
  },
];
