import { render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { catalog } from "~/i18n/catalog";
import { FeatureWorkflowSection } from "./feature-workflow";

const { useLocale } = vi.hoisted(() => ({ useLocale: vi.fn() }));

vi.mock("~/i18n/locale-provider", () => ({ useLocale }));

describe("FeatureWorkflowSection", () => {
  test("shows three English feature stories and the ordered workflow", () => {
    useLocale.mockReturnValue({ locale: "en", copy: catalog.en });
    render(<FeatureWorkflowSection />);

    const section = screen.getByRole("region", {
      name: "Support that follows the question",
    });
    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(
      within(section).getByRole("heading", {
        name: "Answer with context",
        level: 3,
      }),
    ).toBeVisible();
    expect(
      within(section).getByRole("heading", {
        name: "Keep the handoff human",
        level: 3,
      }),
    ).toBeVisible();
    expect(
      within(section).getByRole("heading", {
        name: "See where questions land",
        level: 3,
      }),
    ).toBeVisible();
    const workflow = within(within(section).getByRole("list"));

    expect(workflow.getByText("Visitor question")).toBeVisible();
    expect(workflow.getByText("AI answer")).toBeVisible();
    expect(workflow.getByText("Human takeover")).toBeVisible();
  });

  test("renders only the selected Simplified Chinese feature copy", () => {
    useLocale.mockReturnValue({
      locale: "zh-CN",
      copy: catalog["zh-CN"],
    });
    render(<FeatureWorkflowSection />);

    expect(
      screen.getByRole("region", { name: "让支持跟随每一个问题" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "结合上下文回答", level: 3 }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", {
        name: "Answer with context",
        level: 3,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("访客提问", { exact: true })).toBeVisible();
    expect(screen.getByText("AI 回答", { exact: true })).toBeVisible();
    expect(screen.getByText("人工接管", { exact: true })).toBeVisible();
  });
});
