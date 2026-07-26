import type { Locale } from "~/i18n/catalog";

export type DashboardQueue = "all" | "ai" | "human";

type LocalizedDashboardText = Record<Locale, string>;

export type DashboardConversation = {
  id: string;
  customer: string;
  topic: string;
  queue: Exclude<DashboardQueue, "all">;
  waitTime: string;
  preview: LocalizedDashboardText;
  summary: LocalizedDashboardText;
  status: LocalizedDashboardText;
};

export const dashboardConversations: readonly DashboardConversation[] = [
  {
    id: "conv-billing",
    customer: "Maya Chen",
    topic: "Billing",
    queue: "ai",
    waitTime: "2 min",
    preview: {
      en: "Can I update the card for our next renewal?",
      "zh-CN": "我可以更新下一次续费使用的信用卡吗？",
    },
    summary: {
      en: "Asked how to update the payment method before renewal.",
      "zh-CN": "咨询如何在续费前更新付款方式。",
    },
    status: {
      en: "AI resolving",
      "zh-CN": "AI 正在处理",
    },
  },
  {
    id: "conv-setup",
    customer: "Liam Foster",
    topic: "Product setup",
    queue: "ai",
    waitTime: "5 min",
    preview: {
      en: "Where do I add teammates to our workspace?",
      "zh-CN": "我在哪里可以将队友添加到工作区？",
    },
    summary: {
      en: "Needs help inviting teammates during initial setup.",
      "zh-CN": "需要在初始设置期间邀请队友的帮助。",
    },
    status: {
      en: "AI resolving",
      "zh-CN": "AI 正在处理",
    },
  },
  {
    id: "conv-refund",
    customer: "Sofia Ramirez",
    topic: "Refund request",
    queue: "human",
    waitTime: "12 min",
    preview: {
      en: "I need a refund for my annual plan.",
      "zh-CN": "我需要为年度套餐申请退款。",
    },
    summary: {
      en: "Requested a refund and was handed off to a support specialist.",
      "zh-CN": "客户申请退款，已转交给客服专员处理。",
    },
    status: {
      en: "Waiting for human support",
      "zh-CN": "等待人工客服",
    },
  },
];

export function filterDashboardConversations(
  queue: DashboardQueue,
): readonly DashboardConversation[] {
  return queue === "all"
    ? dashboardConversations
    : dashboardConversations.filter(
        (conversation) => conversation.queue === queue,
      );
}
