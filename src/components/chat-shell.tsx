import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";

export function ChatShell() {
  return (
    <aside aria-labelledby="chat-shell-title" className="chat-shell">
      <div className="chat-shell__topline">
        <span aria-hidden="true" className="chat-shell__mark">
          N
        </span>
        <div>
          <h2 id="chat-shell-title" translate="no">
            {catalog.en.chatShell.title}
          </h2>
          <p className="chat-shell__status">
            <span aria-hidden="true" />
            <LocalizedText
              en={catalog.en.chatShell.status}
              zhCN={catalog["zh-CN"].chatShell.status}
            />
          </p>
        </div>
      </div>
      <p className="chat-shell__description">
        <LocalizedText
          en={catalog.en.chatShell.description}
          zhCN={catalog["zh-CN"].chatShell.description}
        />
      </p>
      <div className="chat-shell__metric">
        <span>
          <LocalizedText en="Typical first reply" zhCN="常见首次回复" />
        </span>
        <strong>
          <LocalizedText en="< 30 sec" zhCN="< 30 秒" />
        </strong>
      </div>
    </aside>
  );
}
