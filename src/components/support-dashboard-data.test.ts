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
      expect(conversation.topic).toEqual({
        en: expect.any(String),
        "zh-CN": expect.any(String),
      });
      expect(conversation.waitTime).toEqual({
        en: expect.any(String),
        "zh-CN": expect.any(String),
      });

      for (const locale of ["en", "zh-CN"] as const) {
        expect(conversation.preview[locale]).not.toBe("");
        expect(conversation.summary[locale]).not.toBe("");
        expect(conversation.status[locale]).not.toBe("");
      }
    }
  });
});
