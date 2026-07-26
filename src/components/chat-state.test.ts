import { describe, expect, test } from "vitest";
import { initialChatState, transitionChat } from "./chat-state";

describe("deterministic chat state", () => {
  test("answers a pricing quick action after the local typing state", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      intent: "pricing",
    });
    const answered = transitionChat(typing, { type: "resolve" });

    expect(typing.phase).toBe("typing");
    expect(answered.phase).toBe("answered");
    expect(answered.messages).toMatchObject([
      { sender: "visitor", intent: "pricing" },
      { sender: "assistant", intent: "pricing" },
    ]);
  });

  test("turns arbitrary submitted text into the localized fallback intent", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      text: "Where is the export endpoint?",
    });
    const answered = transitionChat(typing, { type: "resolve" });

    expect(answered.messages.at(-1)).toMatchObject({
      sender: "assistant",
      intent: "fallback",
    });
  });

  test("keeps the first request while a reply is typing or human handoff is pending", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      intent: "human",
    });
    const ignoredWhileTyping = transitionChat(typing, {
      type: "submit",
      intent: "pricing",
    });
    const pending = transitionChat(typing, { type: "resolve" });
    const ignoredWhilePending = transitionChat(pending, {
      type: "submit",
      intent: "refunds",
    });

    expect(ignoredWhileTyping).toBe(typing);
    expect(pending.phase).toBe("pending");
    expect(ignoredWhilePending).toBe(pending);
  });

  test("preserves messages when the launcher closes and reopens", () => {
    const answered = transitionChat(
      transitionChat(
        transitionChat(initialChatState, {
          type: "submit",
          intent: "features",
        }),
        { type: "resolve" },
      ),
      { type: "close" },
    );
    const reopened = transitionChat(answered, { type: "open" });

    expect(reopened.isOpen).toBe(true);
    expect(reopened.messages).toEqual(answered.messages);
  });
});
