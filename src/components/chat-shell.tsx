"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useLocale } from "~/i18n/locale-provider";
import {
  type ChatIntent,
  type ChatMessage,
  initialChatState,
  transitionChat,
} from "./chat-state";

const QUICK_ACTIONS: readonly Exclude<ChatIntent, "fallback">[] = [
  "pricing",
  "refunds",
  "features",
  "human",
];

export function ChatShell() {
  const { copy } = useLocale();
  const [state, dispatch] = useReducer(transitionChat, initialChatState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const controlsDisabled =
    state.phase === "typing" || state.phase === "pending";
  const lastAssistantMessage = [...state.messages]
    .reverse()
    .find(
      (message): message is Extract<ChatMessage, { sender: "assistant" }> =>
        message.sender === "assistant",
    );
  const replyIsLive =
    lastAssistantMessage !== undefined &&
    state.phase !== "typing" &&
    state.phase !== "pending";
  const status =
    state.phase === "typing"
      ? copy.chatShell.typing
      : state.phase === "pending"
        ? copy.chatShell.pending
        : lastAssistantMessage === undefined
          ? ""
          : copy.chatShell.replies[lastAssistantMessage.intent];

  const closeChat = useCallback(() => {
    dispatch({ type: "close" });
    setApiKeyDraft("");
    setIsSettingsOpen(false);
  }, []);

  useEffect(() => {
    if (state.phase !== "typing") {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: "resolve" });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (state.isOpen) {
      titleRef.current?.focus();
    }
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      closeChat();
      launcherRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeChat, state.isOpen]);

  const toggleChat = () => {
    if (state.isOpen) {
      closeChat();
      launcherRef.current?.focus();
      return;
    }

    dispatch({ type: "open" });
  };

  const submitDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "submit" });
  };

  return (
    <>
      {state.isOpen ? (
        <section
          aria-describedby="chat-shell-description"
          aria-labelledby="chat-shell-title"
          aria-modal="false"
          className="chat-shell"
          id="support-chat"
          role="dialog"
        >
          <div className="chat-shell__header">
            <div className="chat-shell__identity">
              <span aria-hidden="true" className="chat-shell__mark">
                N
              </span>
              <h2
                id="chat-shell-title"
                ref={titleRef}
                tabIndex={-1}
                translate="no"
              >
                {copy.chatShell.title}
              </h2>
            </div>
            <button
              aria-controls="chat-demo-settings"
              aria-expanded={isSettingsOpen}
              className="chat-shell__settings-toggle"
              onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
              type="button"
            >
              {isSettingsOpen
                ? copy.chatShell.settingsClose
                : copy.chatShell.settingsOpen}
            </button>
            {isSettingsOpen ? (
              <section
                aria-label={copy.chatShell.settingsLabel}
                className="chat-shell__settings"
                id="chat-demo-settings"
              >
                <label htmlFor="chat-api-key">
                  {copy.chatShell.apiKeyLabel}
                </label>
                <input
                  autoComplete="off"
                  id="chat-api-key"
                  inputMode="text"
                  onChange={(event) =>
                    setApiKeyDraft(event.currentTarget.value)
                  }
                  placeholder={copy.chatShell.apiKeyPlaceholder}
                  spellCheck={false}
                  type="password"
                  value={apiKeyDraft}
                />
                <p className="chat-shell__settings-status">
                  {copy.chatShell.apiKeyWarning}
                </p>
                <p className="chat-shell__settings-warning">
                  {copy.chatShell.apiKeyDoNotUseRealSecret}
                </p>
              </section>
            ) : null}
          </div>

          <div className="chat-shell__messages">
            <p className="chat-shell__welcome" id="chat-shell-description">
              {copy.chatShell.welcome}
            </p>
            {state.messages.map((message) =>
              replyIsLive && message === lastAssistantMessage ? null : (
                <p
                  className={`chat-shell__message chat-shell__message--${message.sender}`}
                  key={message.id}
                >
                  {message.sender === "assistant"
                    ? copy.chatShell.replies[message.intent]
                    : "intent" in message
                      ? copy.chatShell.quickActions[message.intent]
                      : message.text}
                </p>
              ),
            )}
            <p
              aria-atomic="true"
              aria-live="polite"
              className={
                replyIsLive
                  ? "chat-shell__message chat-shell__message--assistant"
                  : "chat-shell__status"
              }
              role="status"
            >
              {status}
            </p>
          </div>

          <div className="chat-shell__quick-actions">
            {QUICK_ACTIONS.map((intent) => (
              <button
                disabled={controlsDisabled}
                key={intent}
                onClick={() => dispatch({ type: "submit", intent })}
                type="button"
              >
                {copy.chatShell.quickActions[intent]}
              </button>
            ))}
          </div>

          <form className="chat-shell__form" onSubmit={submitDraft}>
            <label htmlFor="chat-question">{copy.chatShell.inputLabel}</label>
            <div className="chat-shell__form-row">
              <input
                autoComplete="off"
                disabled={controlsDisabled}
                id="chat-question"
                name="question"
                onChange={(event) =>
                  dispatch({ type: "change", value: event.currentTarget.value })
                }
                placeholder={copy.chatShell.inputPlaceholder}
                type="text"
                value={state.draft}
              />
              <button disabled={controlsDisabled} type="submit">
                {copy.chatShell.send}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        aria-controls="support-chat"
        aria-expanded={state.isOpen}
        className="chat-shell__launcher"
        onClick={toggleChat}
        ref={launcherRef}
        type="button"
      >
        <span aria-hidden="true">N</span>
        {state.isOpen
          ? copy.chatShell.launcherClose
          : copy.chatShell.launcherOpen}
      </button>
    </>
  );
}
