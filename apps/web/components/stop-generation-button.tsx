"use client";

import { useAgent, UseAgentUpdate } from "@copilotkit/react-core/v2";

export function StopGenerationButton() {
  const { agent } = useAgent({
    agentId: "roomBookingAgent",
    updates: [UseAgentUpdate.OnRunStatusChanged],
  });

  if (!agent.isRunning) {
    return null;
  }

  const handleStop = () => {
    try {
      agent.abortRun();
    } catch (err) {
      console.error("[Stop] abortRun() threw:", err);
    }
  };

  return (
    <button
      onClick={handleStop}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-md transition hover:bg-gray-50"
    >
      <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gray-700" />
      Stop generating
    </button>
  );
}
