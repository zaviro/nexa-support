"use client";

import { useState } from "react";
import { useLocale } from "~/i18n/locale-provider";
import {
  type DashboardQueue,
  dashboardConversations,
  filterDashboardConversations,
} from "./support-dashboard-data";

const queues: readonly DashboardQueue[] = ["all", "ai", "human"];
const fallbackActivityPath =
  "M4 53 C38 52 45 30 78 36 S120 60 154 32 S198 16 236 20";
const activityPaths: Readonly<Record<string, string>> = {
  "conv-billing": fallbackActivityPath,
  "conv-setup": "M4 28 C34 26 48 54 78 48 S118 14 154 24 S202 52 236 18",
  "conv-refund": "M4 58 C32 56 48 38 78 44 S118 26 154 40 S198 16 236 26",
};

function getInitialConversation() {
  const initialConversation = dashboardConversations[0];

  if (initialConversation === undefined) {
    throw new Error("Support dashboard requires at least one conversation.");
  }

  return initialConversation;
}

const initialConversation = getInitialConversation();

export function SupportDashboard() {
  const { copy, locale } = useLocale();
  const [queue, setQueue] = useState<DashboardQueue>("all");
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversation.id,
  );
  const conversations = filterDashboardConversations(queue);
  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? conversations[0];

  function selectQueue(nextQueue: DashboardQueue) {
    const nextConversations = filterDashboardConversations(nextQueue);
    const nextSelectedConversation = nextConversations[0];

    if (nextSelectedConversation === undefined) {
      return;
    }

    setQueue(nextQueue);
    setSelectedConversationId(nextSelectedConversation.id);
  }

  if (selectedConversation === undefined) {
    return null;
  }

  const activityPath =
    activityPaths[selectedConversation.id] ?? fallbackActivityPath;

  return (
    <section
      aria-label={copy.dashboard.regionLabel}
      className="support-dashboard"
    >
      <header className="support-dashboard__heading">
        <p className="section-kicker">
          <span aria-hidden="true">N—02</span>
          {copy.dashboard.eyebrow}
        </p>
        <h2>{copy.dashboard.title}</h2>
        <p>{copy.dashboard.description}</p>
      </header>

      <div className="support-dashboard__metrics">
        <div className="support-dashboard__metric">
          <strong>{copy.dashboard.metrics.automated.value}</strong>
          <span>{copy.dashboard.metrics.automated.label}</span>
        </div>
        <div className="support-dashboard__metric">
          <strong>{copy.dashboard.metrics.online.value}</strong>
          <span>{copy.dashboard.metrics.online.label}</span>
        </div>
        <div className="support-dashboard__metric">
          <strong>{copy.dashboard.metrics.deployment.value}</strong>
          <span>{copy.dashboard.metrics.deployment.label}</span>
        </div>
      </div>

      <div className="support-dashboard__workspace">
        <div className="support-dashboard__inbox">
          <div className="support-dashboard__inbox-heading">
            <h3>{copy.dashboard.inboxLabel}</h3>
            <span>{conversations.length}</span>
          </div>
          <fieldset className="support-dashboard__filters">
            <legend className="visually-hidden">
              {copy.dashboard.queueLabel}
            </legend>
            {queues.map((queueOption) => (
              <button
                aria-pressed={queue === queueOption}
                className="support-dashboard__filter"
                key={queueOption}
                onClick={() => selectQueue(queueOption)}
                type="button"
              >
                {copy.dashboard.queues[queueOption]}
              </button>
            ))}
          </fieldset>
          <ul className="support-dashboard__conversation-list">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  aria-label={copy.dashboard.selectionAccessibleName.replace(
                    "{customer}",
                    conversation.customer,
                  )}
                  aria-pressed={selectedConversation.id === conversation.id}
                  className="support-dashboard__conversation"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  type="button"
                >
                  <span className="support-dashboard__conversation-topline">
                    <strong>{conversation.customer}</strong>
                    <span>{conversation.waitTime}</span>
                  </span>
                  <span>{conversation.preview[locale]}</span>
                  <span className="support-dashboard__conversation-queue">
                    {copy.dashboard.queues[conversation.queue]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <article
          aria-label={copy.dashboard.detail.label}
          aria-live="polite"
          className="support-dashboard__detail"
        >
          <div className="support-dashboard__detail-heading">
            <span>{copy.dashboard.detail.label}</span>
            <span>{selectedConversation.waitTime}</span>
          </div>
          <h3>{selectedConversation.topic}</h3>
          <p>{selectedConversation.summary[locale]}</p>
          <dl className="support-dashboard__detail-meta">
            <div>
              <dt>{copy.dashboard.detail.customerLabel}</dt>
              <dd>{selectedConversation.customer}</dd>
            </div>
            <div>
              <dt>{copy.dashboard.detail.statusLabel}</dt>
              <dd>{selectedConversation.status[locale]}</dd>
            </div>
          </dl>
          <div
            className={`support-dashboard__activity support-dashboard__activity--${selectedConversation.queue}`}
          >
            <div>
              <span>{copy.dashboard.detail.activityLabel}</span>
            </div>
            <svg aria-hidden="true" viewBox="0 0 240 72">
              <path d={activityPath} />
              <circle cx="4" cy="53" r="4" />
              <circle cx="78" cy="36" r="4" />
              <circle cx="154" cy="32" r="4" />
              <circle cx="236" cy="20" r="4" />
            </svg>
          </div>
        </article>
      </div>
    </section>
  );
}
