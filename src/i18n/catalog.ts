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
    status: string;
    description: string;
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
      status: "Support online",
      description: "Ask a question and see how your support flow can begin.",
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
      status: "支持在线",
      description: "提出问题，看看你的客服流程如何开始。",
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
