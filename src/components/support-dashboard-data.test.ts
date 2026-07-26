import { describe, expect, test } from "vitest";
import {
  dashboardConversations,
  filterDashboardConversations,
} from "./support-dashboard-data";

describe("support dashboard data", () => {
  test("filters the visible inbox by queue", () => {
    expect(filterDashboardConversations("human").map(({ id }) => id)).toEqual([
      "conv-refund",
    ]);
  });

  test("provides bilingual details for every conversation", () => {
    for (const conversation of dashboardConversations) {
      expect(conversation.preview.en).not.toBe("");
      expect(conversation.preview["zh-CN"]).not.toBe("");
      expect(conversation.summary.en).not.toBe("");
      expect(conversation.summary["zh-CN"]).not.toBe("");
    }
  });
});
