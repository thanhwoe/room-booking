import "@copilotkit/react-core/v2/styles.css";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { BookingListCard } from "@/components/booking-list-card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-4 px-4 py-20">
      <BookingListCard />
      <CopilotChat
        labels={{
          modalHeaderTitle: "Room Booking Assistant",
          welcomeMessageText: "Hi! What do you need?",
        }}
      />
    </div>
  );
}
