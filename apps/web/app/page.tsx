import "@copilotkit/react-core/v2/styles.css";
import { BookingListCard } from "@/components/booking-list-card";
import { BookingConfirmCard } from "@/components/booking-confirm-card";
import { ChatAssistant } from "@/components/chat-assistant";

export default function Home() {
  return (
    <>
      <BookingListCard />
      <BookingConfirmCard />
      <ChatAssistant />
    </>
  );
}
