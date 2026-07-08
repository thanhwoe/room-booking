import "@copilotkit/react-core/v2/styles.css";
import { CopilotChat } from "@copilotkit/react-core/v2";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-4 px-4 py-20">
      <CopilotChat
        labels={{
          modalHeaderTitle: "Weather Agent",
          welcomeMessageText:
            "Hi! 👋 Ask me about the weather, forecasts, and climate.",
        }}
      />
    </div>
  );
}
