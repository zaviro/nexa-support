import type { ChatIntent } from "~/components/chat-state";

export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = "en" | "zh-CN";

export type SiteCopy = {
  navigation: {
    product: string;
    pricing: string;
    logIn: string;
    startFree: string;
  };
  hero: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  outcomes: {
    label: string;
    automated: { value: string; label: string };
    online: { value: string; label: string };
    deployment: { value: string; label: string };
  };
  dashboard: {
    eyebrow: string;
    title: string;
    description: string;
    regionLabel: string;
    queueLabel: string;
    queues: Record<"all" | "ai" | "human", string>;
    metrics: {
      automated: { value: string; label: string };
      online: { value: string; label: string };
      deployment: { value: string; label: string };
    };
    inboxLabel: string;
    detail: {
      label: string;
      customerLabel: string;
      statusLabel: string;
      activityLabel: string;
    };
    selectionAccessibleName: string;
  };
  features: {
    title: string;
    description: string;
  };
  pricing: {
    title: string;
    description: string;
  };
  chatShell: {
    title: string;
    launcherOpen: string;
    launcherClose: string;
    welcome: string;
    inputLabel: string;
    inputPlaceholder: string;
    send: string;
    typing: string;
    pending: string;
    quickActions: Record<"pricing" | "refunds" | "features" | "human", string>;
    replies: Record<ChatIntent, string>;
  };
  login: {
    title: string;
    description: string;
    backToHome: string;
  };
  footer: {
    promise: string;
  };
};

export const catalog: Record<Locale, SiteCopy> = {
  en: {
    navigation: {
      product: "Product",
      pricing: "Pricing",
      logIn: "Log in",
      startFree: "Start free",
    },
    hero: {
      title: "Resolve customer questions instantly",
      description: "An AI support assistant for growing SaaS teams.",
      primaryAction: "Start free",
      secondaryAction: "Explore product",
    },
    outcomes: {
      label: "Support outcomes",
      automated: { value: "70%", label: "automated" },
      online: { value: "24/7", label: "online" },
      deployment: { value: "30 seconds", label: "to deploy" },
    },
    dashboard: {
      eyebrow: "Support pulse",
      title: "A live view of every support path",
      description:
        "See how questions move from an AI answer to the right teammate.",
      regionLabel: "Nexa Support dashboard",
      queueLabel: "Conversation queues",
      queues: {
        all: "All conversations",
        ai: "AI resolving",
        human: "Human handoff",
      },
      metrics: {
        automated: { value: "1 inbox", label: "for every support path" },
        online: { value: "3 queues", label: "visible at once" },
        deployment: { value: "1 handoff", label: "when judgment matters" },
      },
      inboxLabel: "Customer inbox",
      detail: {
        label: "Conversation detail",
        customerLabel: "Customer",
        statusLabel: "Status",
        activityLabel: "Activity",
      },
      selectionAccessibleName: "Open {customer} conversation",
    },
    features: {
      title: "Support that follows the question",
      description:
        "Give every customer a clear path from their first question to the right answer.",
    },
    pricing: {
      title: "Simple pricing for growing support teams",
      description:
        "Start with a focused support assistant and scale when your team is ready.",
    },
    chatShell: {
      title: "Nexa Support",
      launcherOpen: "Open support chat",
      launcherClose: "Close support chat",
      welcome:
        "Hi — choose a topic or type a question. This demo replies locally.",
      inputLabel: "Your question",
      inputPlaceholder: "Type your question",
      send: "Send",
      typing: "Nexa Support is typing…",
      pending: "Demo human handoff pending. No contact details are collected.",
      quickActions: {
        pricing: "Pricing",
        refunds: "Refunds",
        features: "Product features",
        human: "Contact a human",
      },
      replies: {
        pricing:
          "Starter is ¥99/month and Pro is ¥299/month in this local demo.",
        refunds:
          "Refund requests are reviewed by a teammate; this demo does not collect account details.",
        features:
          "Nexa Support demonstrates AI answers, human handoff, and support analytics.",
        human:
          "You are in the demo handoff queue. No contact details are collected.",
        fallback:
          "I can help with pricing, refunds, product features, or a human handoff in this demo.",
      },
    },
    login: {
      title: "Welcome to the Nexa Support demo",
      description:
        "This localized demo is for exploration only. Authentication is not connected.",
      backToHome: "Back to homepage",
    },
    footer: {
      promise: "Clear answers for every customer question.",
    },
  },
  "zh-CN": {
    navigation: {
      product: "产品",
      pricing: "价格",
      logIn: "登录",
      startFree: "免费试用",
    },
    hero: {
      title: "立即解决客户问题",
      description: "面向成长型 SaaS 团队的 AI 客服助手。",
      primaryAction: "免费试用",
      secondaryAction: "了解产品",
    },
    outcomes: {
      label: "客服成效",
      automated: { value: "70%", label: "自动解决" },
      online: { value: "24/7", label: "支持在线" },
      deployment: { value: "30 秒", label: "完成部署" },
    },
    dashboard: {
      eyebrow: "客服脉络",
      title: "清晰掌握每一条客服路径",
      description: "查看问题如何从 AI 回答流转到合适的团队成员。",
      regionLabel: "Nexa Support 客服看板",
      queueLabel: "会话队列",
      queues: {
        all: "全部会话",
        ai: "AI 正在处理",
        human: "人工接管",
      },
      metrics: {
        automated: { value: "1 个收件箱", label: "覆盖每一条客服路径" },
        online: { value: "3 个队列", label: "一目了然" },
        deployment: { value: "1 次接管", label: "需要人工判断时" },
      },
      inboxLabel: "客户收件箱",
      detail: {
        label: "会话详情",
        customerLabel: "客户",
        statusLabel: "状态",
        activityLabel: "处理动态",
      },
      selectionAccessibleName: "打开 {customer} 的会话",
    },
    features: {
      title: "让支持跟随每一个问题",
      description: "从第一个问题到合适答案，为每位客户提供清晰的解决路径。",
    },
    pricing: {
      title: "为成长中的客服团队提供简单定价",
      description: "从专注的客服助手开始，在团队准备好后轻松扩展。",
    },
    chatShell: {
      title: "Nexa Support",
      launcherOpen: "打开客服聊天",
      launcherClose: "关闭客服聊天",
      welcome: "您好——请选择一个主题或输入问题。本演示将在本地回复。",
      inputLabel: "您的问题",
      inputPlaceholder: "输入您的问题",
      send: "发送",
      typing: "Nexa Support 正在输入…",
      pending: "演示人工接管正在等待中。我们不会收集联系信息。",
      quickActions: {
        pricing: "价格",
        refunds: "退款",
        features: "产品功能",
        human: "联系人工",
      },
      replies: {
        pricing: "本地演示中，入门版为 ¥99/月，专业版为 ¥299/月。",
        refunds: "退款申请将由团队成员审核；本演示不会收集账户详情。",
        features: "Nexa Support 展示 AI 回答、人工接管和客服数据分析。",
        human: "您已进入演示接管队列。我们不会收集联系信息。",
        fallback: "本演示可以帮助您了解价格、退款、产品功能或人工接管。",
      },
    },
    login: {
      title: "欢迎体验 Nexa Support 演示",
      description: "这是用于体验的本地化演示，认证功能尚未连接。",
      backToHome: "返回首页",
    },
    footer: {
      promise: "为每一个客户问题提供清晰答案。",
    },
  },
};
