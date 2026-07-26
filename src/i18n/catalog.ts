import type { ChatIntent } from "~/components/chat-state";

export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = "en" | "zh-CN";

export type FeatureStoryCopy = {
  title: string;
  description: string;
  visualLabel: string;
};

export type WorkflowStepCopy = {
  title: string;
  description: string;
};

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
  featureWorkflow: {
    eyebrow: string;
    title: string;
    description: string;
    stories: {
      aiAnswers: FeatureStoryCopy;
      humanTakeover: FeatureStoryCopy;
      analytics: FeatureStoryCopy;
    };
    workflow: {
      eyebrow: string;
      title: string;
      description: string;
      steps: readonly [WorkflowStepCopy, WorkflowStepCopy, WorkflowStepCopy];
    };
  };
  pricing: {
    title: string;
    description: string;
  };
  decisionPath: {
    testimonialLabel: string;
    testimonialsTitle: string;
    testimonials: readonly { quote: string; attribution: string }[];
    pricing: {
      eyebrow: string;
      title: string;
      description: string;
      monthlySuffix: string;
      plans: readonly {
        name: "Starter" | "Pro";
        audience: string;
        description: string;
        price: "¥99" | "¥299";
        cta: string;
      }[];
    };
    faq: {
      eyebrow: string;
      title: string;
      items: readonly {
        id:
          | "ai-answers"
          | "human-takeover"
          | "deployment"
          | "refunds"
          | "data-privacy";
        question: string;
        answer: string;
      }[];
    };
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
    featureWorkflow: {
      eyebrow: "Product preview",
      title: "Support that follows the question",
      description:
        "Give every customer a clear path from their first question to the right answer.",
      stories: {
        aiAnswers: {
          title: "Answer with context",
          description:
            "Turn product knowledge into a direct, useful first response.",
          visualLabel: "Context match · 96%",
        },
        humanTakeover: {
          title: "Keep the handoff human",
          description:
            "Pass the question and its context to a teammate when judgment matters.",
          visualLabel: "Escalation queue · 2 waiting",
        },
        analytics: {
          title: "See where questions land",
          description:
            "Give the team a readable view of recurring questions and outcomes.",
          visualLabel: "Question outcomes · 7 days",
        },
      },
      workflow: {
        eyebrow: "Support workflow",
        title: "One visible route to resolution",
        description:
          "Each step keeps the original question and its context moving forward.",
        steps: [
          {
            title: "Visitor question",
            description: "A customer asks from the page they are viewing.",
          },
          {
            title: "AI answer",
            description:
              "The assistant finds the relevant product context and responds.",
          },
          {
            title: "Human takeover",
            description:
              "A teammate receives the full thread when judgment is needed.",
          },
        ],
      },
    },
    pricing: {
      title: "Simple pricing for growing support teams",
      description:
        "Start with a focused support assistant and scale when your team is ready.",
    },
    decisionPath: {
      testimonialLabel: "Demo testimonial",
      testimonialsTitle: "Fictional feedback, visibly labeled",
      testimonials: [
        {
          quote:
            "“Nexa gives our demo team a clear place to start every support conversation.”",
          attribution: "A. Rivera · Fictional product lead",
        },
        {
          quote:
            "“The handoff view makes the next step easy to explain in a walkthrough.”",
          attribution: "M. Zhou · Fictional support manager",
        },
      ],
      pricing: {
        eyebrow: "N—03 · Pricing preview",
        title: "Pricing",
        description:
          "Two fixed local-demo plans for seeing how the support path is presented.",
        monthlySuffix: "/ month",
        plans: [
          {
            name: "Starter",
            audience: "For focused support",
            description:
              "A clear starting point for a growing SaaS team in this local demo.",
            price: "¥99",
            cta: "Start free",
          },
          {
            name: "Pro",
            audience: "For a scaling team",
            description:
              "More room to explore a growing support rhythm in this local demo.",
            price: "¥299",
            cta: "Start free",
          },
        ],
      },
      faq: {
        eyebrow: "N—04 · Local demo FAQ",
        title: "Frequently asked questions",
        items: [
          {
            id: "ai-answers",
            question: "How does Nexa answer questions?",
            answer:
              "This local demo shows a possible support path with fixed sample content; it does not connect to a live AI service.",
          },
          {
            id: "human-takeover",
            question: "How does human takeover work?",
            answer:
              "The demo can show a fictional handoff state, but it does not contact a support team or collect a request.",
          },
          {
            id: "deployment",
            question: "How is Nexa deployed?",
            answer:
              "Deployment is represented as an interface example only. This local demo does not install or configure anything.",
          },
          {
            id: "refunds",
            question: "What is the refund policy?",
            answer:
              "There are no purchases or refunds in this local demo, so it does not make a live refund-policy promise.",
          },
          {
            id: "data-privacy",
            question: "What happens to customer data?",
            answer:
              "This local demo does not send, store, or process customer data.",
          },
        ],
      },
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
    featureWorkflow: {
      eyebrow: "产品预览",
      title: "让支持跟随每一个问题",
      description: "从第一个问题到合适答案，为每位客户提供清晰的解决路径。",
      stories: {
        aiAnswers: {
          title: "结合上下文回答",
          description: "将产品知识转化为直接、实用的首次回复。",
          visualLabel: "上下文匹配 · 96%",
        },
        humanTakeover: {
          title: "顺畅转接人工",
          description: "需要人工判断时，将问题及其上下文一并交给团队成员。",
          visualLabel: "升级队列 · 2 项等待",
        },
        analytics: {
          title: "掌握问题去向",
          description: "让团队清楚了解重复问题及其处理结果。",
          visualLabel: "问题结果 · 7 天",
        },
      },
      workflow: {
        eyebrow: "客服流程",
        title: "一条清晰可见的解决路径",
        description: "每一步都会保留原始问题及其上下文，确保信息持续传递。",
        steps: [
          {
            title: "访客提问",
            description: "客户在当前浏览的页面中提出问题。",
          },
          {
            title: "AI 回答",
            description: "客服助手找到相关产品信息并给出回复。",
          },
          {
            title: "人工接管",
            description: "需要人工判断时，团队成员会收到完整对话。",
          },
        ],
      },
    },
    pricing: {
      title: "为成长中的客服团队提供简单定价",
      description: "从专注的客服助手开始，在团队准备好后轻松扩展。",
    },
    decisionPath: {
      testimonialLabel: "演示评价",
      testimonialsTitle: "虚构反馈，清晰标注",
      testimonials: [
        {
          quote: "“Nexa 让我们的演示团队能够清楚地开始每一次客服对话。”",
          attribution: "A. Rivera · 虚构产品负责人",
        },
        {
          quote: "“交接视图让我们能在演示中轻松说明下一步。”",
          attribution: "M. Zhou · 虚构客服经理",
        },
      ],
      pricing: {
        eyebrow: "N—03 · 价格预览",
        title: "价格",
        description: "两档固定的本地演示方案，用于查看客服路径如何呈现。",
        monthlySuffix: "/ 月",
        plans: [
          {
            name: "Starter",
            audience: "适合专注型客服",
            description: "为成长中的 SaaS 团队提供清晰的本地演示起点。",
            price: "¥99",
            cta: "免费试用",
          },
          {
            name: "Pro",
            audience: "适合扩展中的团队",
            description: "为客服节奏不断增长的团队提供更多本地演示空间。",
            price: "¥299",
            cta: "免费试用",
          },
        ],
      },
      faq: {
        eyebrow: "N—04 · 本地演示 FAQ",
        title: "常见问题",
        items: [
          {
            id: "ai-answers",
            question: "Nexa 如何回答问题？",
            answer:
              "此本地演示使用固定示例内容展示可能的客服路径，并未连接真实 AI 服务。",
          },
          {
            id: "human-takeover",
            question: "人工接管如何运作？",
            answer:
              "演示可以显示虚构的交接状态，但不会联系客服团队，也不会收集请求。",
          },
          {
            id: "deployment",
            question: "Nexa 如何部署？",
            answer:
              "部署仅作为界面示例展示；此本地演示不会安装或配置任何内容。",
          },
          {
            id: "refunds",
            question: "退款政策是什么？",
            answer:
              "此本地演示没有购买或退款，因此不会作出真实的退款政策承诺。",
          },
          {
            id: "data-privacy",
            question: "客户数据会如何处理？",
            answer: "此本地演示不会发送、存储或处理客户数据。",
          },
        ],
      },
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
