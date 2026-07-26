export type ChatIntent =
  | "pricing"
  | "refunds"
  | "features"
  | "human"
  | "fallback";

export type ChatPhase = "welcome" | "input" | "typing" | "answered" | "pending";

export type ChatMessage =
  | {
      id: number;
      sender: "visitor";
      intent: Exclude<ChatIntent, "fallback">;
    }
  | { id: number; sender: "visitor"; text: string }
  | { id: number; sender: "assistant"; intent: ChatIntent };

export type ChatEvent =
  | { type: "open" }
  | { type: "close" }
  | { type: "change"; value: string }
  | {
      type: "submit";
      intent?: Exclude<ChatIntent, "fallback">;
      text?: string;
    }
  | { type: "resolve" };

export type ChatState = {
  isOpen: boolean;
  phase: ChatPhase;
  draft: string;
  pendingIntent: ChatIntent | null;
  messages: readonly ChatMessage[];
};

export const initialChatState: ChatState = {
  isOpen: false,
  phase: "welcome",
  draft: "",
  pendingIntent: null,
  messages: [],
};

export function transitionChat(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "change":
      if (
        !state.isOpen ||
        state.phase === "typing" ||
        state.phase === "pending"
      ) {
        return state;
      }

      return { ...state, draft: event.value, phase: "input" };
    case "submit": {
      if (state.phase === "typing" || state.phase === "pending") {
        return state;
      }

      const text = (event.text ?? state.draft).trim();
      if (event.intent === undefined && text.length === 0) {
        return state;
      }

      const pendingIntent = event.intent ?? "fallback";
      const visitorMessage: ChatMessage =
        event.intent === undefined
          ? { id: state.messages.length, sender: "visitor", text }
          : {
              id: state.messages.length,
              sender: "visitor",
              intent: event.intent,
            };

      return {
        ...state,
        phase: "typing",
        draft: "",
        pendingIntent,
        messages: [...state.messages, visitorMessage],
      };
    }
    case "resolve":
      if (state.phase !== "typing" || state.pendingIntent === null) {
        return state;
      }

      return {
        ...state,
        phase: state.pendingIntent === "human" ? "pending" : "answered",
        pendingIntent: null,
        messages: [
          ...state.messages,
          {
            id: state.messages.length,
            sender: "assistant",
            intent: state.pendingIntent,
          },
        ],
      };
  }
}
