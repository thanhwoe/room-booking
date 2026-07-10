const RESOURCE_ID_STORAGE_KEY = "room-booking:resource-id";

const THREAD_ID_STORAGE_KEY = "room-booking:active-thread-id";

export type ConversationSession = {
  resourceId: string;
  threadId: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readValidId(storageKey: string): string | null {
  if (!isBrowser()) {
    return null;
  }
  const value = window.localStorage.getItem(storageKey)?.trim();

  if (!value) {
    return null;
  }

  return value;
}

export function getOrCreateId({ storageKey }: { storageKey: string }): string {
  const existingId = readValidId(storageKey);

  if (existingId) {
    return existingId;
  }
  const newId = crypto.randomUUID();

  if (!isBrowser()) {
    return newId;
  }

  window.localStorage.setItem(storageKey, newId);

  return newId;
}

export function getOrCreateConversationSession(): ConversationSession {
  if (!isBrowser()) {
    return {
      resourceId: crypto.randomUUID(),
      threadId: crypto.randomUUID(),
    };
  }
  return {
    resourceId: getOrCreateId({
      storageKey: RESOURCE_ID_STORAGE_KEY,
    }),

    threadId: getOrCreateId({
      storageKey: THREAD_ID_STORAGE_KEY,
    }),
  };
}

export function clearConversationSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(RESOURCE_ID_STORAGE_KEY);

  window.localStorage.removeItem(THREAD_ID_STORAGE_KEY);
}
