"use client";

import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";

function AnswerVisual() {
  return (
    <div aria-hidden="true" className="feature-answer-card">
      <div className="feature-answer-card__node">
        <span className="feature-answer-card__mark">?</span>
        <span className="feature-answer-card__lines">
          <i />
          <i />
        </span>
      </div>
      <svg aria-hidden="true" viewBox="0 0 240 58">
        <path d="M34 4 C34 34 86 20 120 30 S181 50 206 26" />
        <circle cx="34" cy="4" r="4" />
        <circle cx="206" cy="26" r="4" />
      </svg>
      <div className="feature-answer-card__node feature-answer-card__node--answer">
        <span className="feature-answer-card__mark">✓</span>
        <span className="feature-answer-card__lines">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}

function HandoffVisual() {
  return (
    <div aria-hidden="true" className="feature-handoff-card">
      <div className="feature-handoff-card__ticket">
        <span>02</span>
        <i />
        <i />
      </div>
      <svg aria-hidden="true" viewBox="0 0 240 52">
        <path d="M18 8 C82 8 78 42 144 42 H218" />
        <circle cx="18" cy="8" r="4" />
        <circle cx="218" cy="42" r="4" />
      </svg>
      <div className="feature-handoff-card__team">
        <span>LW</span>
        <span>MK</span>
        <span>+2</span>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div aria-hidden="true" className="feature-analytics-card">
      <div className="feature-analytics-card__bars">
        <div>
          <span>64%</span>
          <i className="feature-analytics-card__bar feature-analytics-card__bar--primary" />
        </div>
        <div>
          <span>21%</span>
          <i className="feature-analytics-card__bar feature-analytics-card__bar--secondary" />
        </div>
        <div>
          <span>15%</span>
          <i className="feature-analytics-card__bar feature-analytics-card__bar--tertiary" />
        </div>
      </div>
      <svg aria-hidden="true" viewBox="0 0 260 84">
        <path d="M4 70 C38 68 49 50 78 54 S122 20 154 30 S202 52 256 10" />
        <circle cx="78" cy="54" r="4" />
        <circle cx="154" cy="30" r="4" />
        <circle cx="256" cy="10" r="4" />
      </svg>
    </div>
  );
}

const stories = [
  { key: "aiAnswers", visual: <AnswerVisual /> },
  { key: "humanTakeover", visual: <HandoffVisual /> },
  { key: "analytics", visual: <AnalyticsVisual /> },
] as const;

const enFeatureWorkflow = catalog.en.featureWorkflow;
const zhCNFeatureWorkflow = catalog["zh-CN"].featureWorkflow;

export function FeatureWorkflowSection() {
  return (
    <section
      aria-labelledby="features-title"
      className="feature-workflow"
      id="features"
    >
      <header className="feature-workflow__heading">
        <p className="section-kicker">
          <span aria-hidden="true">N—03</span>
          <LocalizedText
            en={enFeatureWorkflow.eyebrow}
            zhCN={zhCNFeatureWorkflow.eyebrow}
          />
        </p>
        <h2 id="features-title">
          <LocalizedText
            en={enFeatureWorkflow.title}
            zhCN={zhCNFeatureWorkflow.title}
          />
        </h2>
        <p>
          <LocalizedText
            en={enFeatureWorkflow.description}
            zhCN={zhCNFeatureWorkflow.description}
          />
        </p>
      </header>

      <div className="feature-workflow__stories">
        {stories.map(({ key, visual }, index) => {
          const enStory = enFeatureWorkflow.stories[key];
          const zhCNStory = zhCNFeatureWorkflow.stories[key];
          const titleId = `feature-story-${index + 1}-title`;

          return (
            <article
              aria-labelledby={titleId}
              className={`feature-workflow__story feature-workflow__story--${key}`}
              key={key}
            >
              <div className="feature-workflow__story-copy">
                <span aria-hidden="true" className="feature-workflow__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 id={titleId}>
                  <LocalizedText en={enStory.title} zhCN={zhCNStory.title} />
                </h3>
                <p>
                  <LocalizedText
                    en={enStory.description}
                    zhCN={zhCNStory.description}
                  />
                </p>
              </div>
              <div className="feature-workflow__visual">
                <span className="feature-workflow__visual-label">
                  <LocalizedText
                    en={enStory.visualLabel}
                    zhCN={zhCNStory.visualLabel}
                  />
                </span>
                {visual}
              </div>
            </article>
          );
        })}
      </div>

      <section
        aria-labelledby="feature-workflow-title"
        className="feature-workflow__route"
      >
        <div className="feature-workflow__route-heading">
          <p className="section-kicker">
            <span aria-hidden="true">N—04</span>
            <LocalizedText
              en={enFeatureWorkflow.workflow.eyebrow}
              zhCN={zhCNFeatureWorkflow.workflow.eyebrow}
            />
          </p>
          <h3 id="feature-workflow-title">
            <LocalizedText
              en={enFeatureWorkflow.workflow.title}
              zhCN={zhCNFeatureWorkflow.workflow.title}
            />
          </h3>
          <p>
            <LocalizedText
              en={enFeatureWorkflow.workflow.description}
              zhCN={zhCNFeatureWorkflow.workflow.description}
            />
          </p>
        </div>
        <ol className="feature-workflow__steps">
          {enFeatureWorkflow.workflow.steps.map((enStep, index) => {
            const zhCNStep = zhCNFeatureWorkflow.workflow.steps[index];

            return (
              <li key={enStep.title}>
                <span
                  aria-hidden="true"
                  className="feature-workflow__step-number"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4>
                    <LocalizedText
                      en={enStep.title}
                      zhCN={zhCNStep?.title ?? ""}
                    />
                  </h4>
                  <p>
                    <LocalizedText
                      en={enStep.description}
                      zhCN={zhCNStep?.description ?? ""}
                    />
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </section>
  );
}
