import { withMermaid } from "vitepress-plugin-mermaid"

// Environment variables for documentation
const DOC_VARS = {
  COMPANY_NAME: "Choiceform",
  COMPANY_DOMAIN: "choiceform.app",
  GITHUB_REPO_URL: "https://github.com/choice-open/automation-docs",
  DISCORD_URL: "https://discord.gg/choiceform",
  PRODUCT_NAME: "Atomemo",
  SUPPORT_EMAIL: "support@choiceform.app",
  SALES_EMAIL: "sales@choiceform.app",
  PARTNER_EMAIL: "partners@choiceform.app",
  NEXT_PUBLIC_SUPPORT_EMAIL: "support@choiceform.app",
  REGISTERED_OFFICE_ADDRESS_CHINA: "中国上海市xxx区xxx路xxx号",
  REGISTERED_OFFICE_ADDRESS_HONG_KONG: "香港xxx区xxx路xxx号",
  HELP_CENTER_URL: "https://help.choiceform.com",
}

// Function to replace variables in content
function replaceDocVars(content: string): string {
  let result = content
  Object.entries(DOC_VARS).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g")
    result = result.replace(regex, value)
  })
  return result
}

// Vite plugin to replace variables in markdown files
function markdownVariablesPlugin() {
  return {
    name: "markdown-variables",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      // Only process markdown files
      if (id.endsWith(".md")) {
        return {
          code: replaceDocVars(code),
          map: null,
        }
      }
    },
  }
}

export default withMermaid({
  ignoreDeadLinks: true,
  cleanUrls: true,

  head: [
    ["meta", { charset: "UTF-8" }],
    ["meta", { "http-equiv": "X-UA-Compatible", content: "IE=edge" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      },
    ],

    // Fonts
    ["link", { rel: "preconnect", href: "https://rsms.me/" }],
    ["link", { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" }],

    // Favicons
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "https://assets.choiceform.app/favicons/atomemo/color-plain/favicon.svg?v=1",
      },
    ],
    [
      "link",
      {
        id: "favIconCanvas",
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "https://assets.choiceform.app/favicons/atomemo/color-plain/favicon-32x32.png?v=1",
      },
    ],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "https://assets.choiceform.app/favicons/atomemo/color-plain/favicon.ico?v=1",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "https://assets.choiceform.app/favicons/atomemo/color-plain/apple-touch-icon.png?v=1",
      },
    ],

    // Meta tags
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Atomemo" }],
    ["meta", { name: "application-name", content: `Atomemo ${DOC_VARS.PRODUCT_NAME}` }],

    // Additional meta
    ["link", { rel: "profile", href: "http://gmpg.org/xfn/11" }],
    ["link", { rel: "canonical", href: "https://www.choiceform.com" }],
  ],

  vite: {
    plugins: [markdownVariablesPlugin()],
    optimizeDeps: {
      include: ["mermaid"],
    },
  },

  locales: {
    "zh-hans": {
      label: "简体中文",
      lang: "zh-CN",
      title: "文档",
      description: `${DOC_VARS.PRODUCT_NAME} 文档`,
      themeConfig: {
        nav: [
          { text: "开始使用", link: "/zh-hans/" },
          { text: "用户指南", link: "/zh-hans/guide/" },
          { text: "插件", link: "/zh-hans/plugins/" },
          { text: "开发文档", link: "/zh-hans/development/" },
          { text: "政策条款", link: "/zh-hans/policies/" },
        ],

        sidebar: {
          "/zh-hans/getting-started/": [
            {
              text: "开始使用",
              items: [
                { text: "介绍", link: "/zh-hans/" },
                { text: "平台能力", link: "/zh-hans/getting-started/capabilities" },
                {
                  text: `选择你的 ${DOC_VARS.PRODUCT_NAME}`,
                  link: "/zh-hans/getting-started/choose-your-automation",
                },
              ],
            },
          ],

          "/zh-hans/": [
            {
              text: "开始使用",
              items: [
                { text: "介绍", link: "/zh-hans/" },
                { text: "平台能力", link: "/zh-hans/getting-started/capabilities" },
                {
                  text: `选择你的 ${DOC_VARS.PRODUCT_NAME}`,
                  link: "/zh-hans/getting-started/choose-your-automation",
                },
              ],
            },
          ],

          "/zh-hans/guide/": [
            {
              text: "用户指南",
              items: [
                { text: "概述", link: "/zh-hans/guide/" },
                { text: "创建应用", link: "/zh-hans/guide/creating-apps" },
                { text: "使用节点", link: "/zh-hans/guide/working-with-nodes" },
                { text: "编辑节点", link: "/zh-hans/guide/editing-nodes" },
                { text: "键盘快捷键", link: "/zh-hans/guide/keyboard-shortcuts" },
              ],
            },
            {
              text: "工作流",
              items: [
                { text: "版本控制", link: "/zh-hans/guide/workflow/version-control" },
                { text: "运行工作流", link: "/zh-hans/guide/workflow/execute-workflow" },
                { text: "调试工作流", link: "/zh-hans/guide/workflow/debug-workflow" },
                {
                  text: "节点",
                  collapsed: false,
                  items: [
                    {
                      text: "触发器节点",
                      collapsed: false,
                      items: [
                        {
                          text: "Chat 触发器",
                          link: "/zh-hans/guide/workflow/nodes/trigger-nodes/chat",
                        },
                        {
                          text: "Manual 触发器",
                          link: "/zh-hans/guide/workflow/nodes/trigger-nodes/manual",
                        },
                        {
                          text: "Webhook 触发器",
                          link: "/zh-hans/guide/workflow/nodes/trigger-nodes/webhook",
                        },
                      ],
                    },
                    {
                      text: "Action 节点",
                      collapsed: false,
                      items: [
                        {
                          text: "AI Agent",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/ai-agent",
                        },
                        {
                          text: "AI 分类器",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/ai-classifier",
                        },
                        { text: "回答", link: "/zh-hans/guide/workflow/nodes/action-nodes/answer" },
                        { text: "代码", link: "/zh-hans/guide/workflow/nodes/action-nodes/code" },
                        {
                          text: "实体识别",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/entity-recognition",
                        },
                        {
                          text: "HTTP 请求",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/http-request",
                        },
                        { text: "条件分支", link: "/zh-hans/guide/workflow/nodes/action-nodes/if" },
                        {
                          text: "知识存储",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/knowledge-ingestion",
                        },
                        {
                          text: "知识检索",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/knowledge-retrieval",
                        },
                        { text: "LLM", link: "/zh-hans/guide/workflow/nodes/action-nodes/llm" },
                        {
                          text: "情感分析",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/sentiment-analysis",
                        },
                        {
                          text: "数据转换",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/transform",
                        },
                        {
                          text: "变量赋值",
                          link: "/zh-hans/guide/workflow/nodes/action-nodes/variable-assigner",
                        },
                        { text: "等待", link: "/zh-hans/guide/workflow/nodes/action-nodes/wait" },
                      ],
                    },
                    {
                      text: "Control 节点",
                      collapsed: false,
                      items: [
                        {
                          text: "循环与迭代",
                          link: "/zh-hans/guide/workflow/nodes/control-nodes/loop-iterate",
                        },
                        {
                          text: "退出循环",
                          link: "/zh-hans/guide/workflow/nodes/control-nodes/break-loop",
                        },
                      ],
                    },
                    {
                      text: "Tool 节点",
                      collapsed: false,
                      items: [
                        { text: "代码工具", link: "/zh-hans/guide/workflow/nodes/tool-nodes/code" },
                        {
                          text: "实体识别工具",
                          link: "/zh-hans/guide/workflow/nodes/tool-nodes/entity-recognition",
                        },
                        {
                          text: "HTTP 请求工具",
                          link: "/zh-hans/guide/workflow/nodes/tool-nodes/http-request",
                        },
                        {
                          text: "知识检索工具",
                          link: "/zh-hans/guide/workflow/nodes/tool-nodes/knowledge-retrieval",
                        },
                        {
                          text: "情感分析工具",
                          link: "/zh-hans/guide/workflow/nodes/tool-nodes/sentiment-analysis",
                        },
                      ],
                    },
                    {
                      text: "分组节点",
                      collapsed: false,
                      items: [
                        {
                          text: "分组节点",
                          link: "/zh-hans/guide/workflow/nodes/group-nodes/group-node",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "表达式方法",
              collapsed: false,
              items: [
                { text: "概述", link: "/zh-hans/guide/expressions" },
                { text: "数组方法", link: "/zh-hans/guide/expressions/arrays" },
                { text: "布尔值方法", link: "/zh-hans/guide/expressions/booleans" },
                { text: "日期方法", link: "/zh-hans/guide/expressions/dates" },
                { text: "数字方法", link: "/zh-hans/guide/expressions/numbers" },
                { text: "对象方法", link: "/zh-hans/guide/expressions/objects" },
                { text: "字符串方法", link: "/zh-hans/guide/expressions/strings" },
              ],
            },
          ],

          "/zh-hans/plugins/": [
            {
              text: "插件",
              items: [
                { text: "概述", link: "/zh-hans/plugins/" },
                { text: "插件市场", link: "/zh-hans/plugins/marketplace" },
                { text: "使用插件", link: "/zh-hans/plugins/using-plugins" },
                {
                  text: "开发插件",
                  collapsed: true,
                  items: [
                    { text: "核心概念", link: "/zh-hans/plugins/development/core-concepts" },
                    { text: "快速上手", link: "/zh-hans/plugins/development/quick-start" },
                  ],
                },
                { text: "插件 API", link: "/zh-hans/plugins/api" },
              ],
            },
          ],

          "/zh-hans/development/": [
            {
              text: "开发文档",
              items: [
                { text: "概述", link: "/zh-hans/development/" },
                { text: "架构设计", link: "/zh-hans/development/architecture" },
                { text: "贡献指南", link: "/zh-hans/development/contributing" },
                { text: "API 参考", link: "/zh-hans/development/api-reference" },
                { text: "测试", link: "/zh-hans/development/testing" },
              ],
            },
          ],

          "/zh-hans/policies/": [
            {
              text: "政策条款",
              items: [
                { text: "概述", link: "/zh-hans/policies/" },
                { text: "服务条款", link: "/zh-hans/policies/terms-of-service" },
                { text: "隐私政策", link: "/zh-hans/policies/privacy-policy" },
                { text: "数据处理协议", link: "/zh-hans/policies/dpa" },
                { text: "可接受使用政策", link: "/zh-hans/policies/acceptable-use" },
                { text: "早期访问计划", link: "/zh-hans/policies/early-access-program" },
                { text: "示例措辞", link: "/zh-hans/policies/sample-wording" },
              ],
            },
          ],
        },

        outline: {
          label: "页面导航",
          level: [2, 3],
        },

        docFooter: {
          prev: "上一页",
          next: "下一页",
        },

        lastUpdated: {
          text: "最后更新于",
          formatOptions: {
            dateStyle: "short",
            timeStyle: "short",
          },
        },

        editLink: {
          pattern: `${DOC_VARS.GITHUB_REPO_URL}/edit/main/:path`,
          text: "在 GitHub 上编辑此页",
        },
      },
    },

    en: {
      label: "English",
      lang: "en-US",
      title: "Docs",
      description: `${DOC_VARS.PRODUCT_NAME} Documentation`,
      themeConfig: {
        nav: [
          { text: "Getting Started", link: "/en/" },
          { text: "Guide", link: "/en/guide/" },
          { text: "Plugins", link: "/en/plugins/" },
          { text: "Development", link: "/en/development/" },
          { text: "Policies", link: "/en/policies/" },
        ],

        sidebar: {
          "/en/getting-started/": [
            {
              text: "Getting Started",
              items: [
                { text: "Introduction", link: "/en/" },
                { text: "Platform Capabilities", link: "/en/getting-started/capabilities" },
                {
                  text: `Choose Your ${DOC_VARS.PRODUCT_NAME}`,
                  link: "/en/getting-started/choose-your-automation",
                },
              ],
            },
          ],

          "/en/": [
            {
              text: "Getting Started",
              items: [
                { text: "Introduction", link: "/en/" },
                { text: "Platform Capabilities", link: "/en/getting-started/capabilities" },
                {
                  text: `Choose Your ${DOC_VARS.PRODUCT_NAME}`,
                  link: "/en/getting-started/choose-your-automation",
                },
              ],
            },
          ],

          "/en/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Overview", link: "/en/guide/" },
                { text: "Creating Apps", link: "/en/guide/creating-apps" },
                { text: "Working with Nodes", link: "/en/guide/working-with-nodes" },
                { text: "Editing Nodes", link: "/en/guide/editing-nodes" },
                { text: "Keyboard Shortcuts", link: "/en/guide/keyboard-shortcuts" },
              ],
            },
            {
              text: "Workflow",
              items: [
                { text: "Version Control", link: "/en/guide/workflow/version-control" },
                { text: "Execute Workflow", link: "/en/guide/workflow/execute-workflow" },
                { text: "Debug Workflow", link: "/en/guide/workflow/debug-workflow" },
                {
                  text: "Nodes",
                  collapsed: false,
                  items: [
                    {
                      text: "Trigger Nodes",
                      collapsed: false,
                      items: [
                        {
                          text: "Chat Trigger",
                          link: "/en/guide/workflow/nodes/trigger-nodes/chat",
                        },
                        {
                          text: "Manual Trigger",
                          link: "/en/guide/workflow/nodes/trigger-nodes/manual",
                        },
                        {
                          text: "Webhook Trigger",
                          link: "/en/guide/workflow/nodes/trigger-nodes/webhook",
                        },
                      ],
                    },
                    {
                      text: "Action Nodes",
                      collapsed: false,
                      items: [
                        {
                          text: "AI Agent",
                          link: "/en/guide/workflow/nodes/action-nodes/ai-agent",
                        },
                        {
                          text: "AI Classifier",
                          link: "/en/guide/workflow/nodes/action-nodes/ai-classifier",
                        },
                        { text: "Answer", link: "/en/guide/workflow/nodes/action-nodes/answer" },
                        { text: "Code", link: "/en/guide/workflow/nodes/action-nodes/code" },
                        {
                          text: "Entity Recognition",
                          link: "/en/guide/workflow/nodes/action-nodes/entity-recognition",
                        },
                        {
                          text: "HTTP Request",
                          link: "/en/guide/workflow/nodes/action-nodes/http-request",
                        },
                        {
                          text: "Conditional Branch",
                          link: "/en/guide/workflow/nodes/action-nodes/if",
                        },
                        {
                          text: "Knowledge Ingestion",
                          link: "/en/guide/workflow/nodes/action-nodes/knowledge-ingestion",
                        },
                        {
                          text: "Knowledge Retrieval",
                          link: "/en/guide/workflow/nodes/action-nodes/knowledge-retrieval",
                        },
                        { text: "LLM", link: "/en/guide/workflow/nodes/action-nodes/llm" },
                        {
                          text: "Sentiment Analysis",
                          link: "/en/guide/workflow/nodes/action-nodes/sentiment-analysis",
                        },
                        {
                          text: "Transform",
                          link: "/en/guide/workflow/nodes/action-nodes/transform",
                        },
                        {
                          text: "Variable Assigner",
                          link: "/en/guide/workflow/nodes/action-nodes/variable-assigner",
                        },
                        { text: "Wait", link: "/en/guide/workflow/nodes/action-nodes/wait" },
                      ],
                    },
                    {
                      text: "Control Nodes",
                      collapsed: false,
                      items: [
                        {
                          text: "Loop & Iterate",
                          link: "/en/guide/workflow/nodes/control-nodes/loop-iterate",
                        },
                        {
                          text: "Break Loop",
                          link: "/en/guide/workflow/nodes/control-nodes/break-loop",
                        },
                      ],
                    },
                    {
                      text: "Tool Nodes",
                      collapsed: false,
                      items: [
                        { text: "Code Tool", link: "/en/guide/workflow/nodes/tool-nodes/code" },
                        {
                          text: "Entity Recognition Tool",
                          link: "/en/guide/workflow/nodes/tool-nodes/entity-recognition",
                        },
                        {
                          text: "HTTP Request Tool",
                          link: "/en/guide/workflow/nodes/tool-nodes/http-request",
                        },
                        {
                          text: "Knowledge Retrieval Tool",
                          link: "/en/guide/workflow/nodes/tool-nodes/knowledge-retrieval",
                        },
                        {
                          text: "Sentiment Analysis Tool",
                          link: "/en/guide/workflow/nodes/tool-nodes/sentiment-analysis",
                        },
                      ],
                    },
                    {
                      text: "Group Nodes",
                      collapsed: false,
                      items: [
                        {
                          text: "Group Node",
                          link: "/en/guide/workflow/nodes/group-nodes/group-node",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              text: "Expression Methods",
              collapsed: false,
              items: [
                { text: "Overview", link: "/en/guide/expressions" },
                { text: "Array Methods", link: "/en/guide/expressions/arrays" },
                { text: "Boolean Methods", link: "/en/guide/expressions/booleans" },
                { text: "Date Methods", link: "/en/guide/expressions/dates" },
                { text: "Number Methods", link: "/en/guide/expressions/numbers" },
                { text: "Object Methods", link: "/en/guide/expressions/objects" },
                { text: "String Methods", link: "/en/guide/expressions/strings" },
              ],
            },
          ],

          "/en/plugins/": [
            {
              text: "Plugins",
              items: [
                { text: "Overview", link: "/en/plugins/" },
                { text: "Plugin Marketplace", link: "/en/plugins/marketplace" },
                { text: "Using Plugins", link: "/en/plugins/using-plugins" },
                { text: "Creating Plugins", link: "/en/plugins/creating-plugins" },
                { text: "Plugin API", link: "/en/plugins/api" },
              ],
            },
          ],

          "/en/development/": [
            {
              text: "Development",
              items: [
                { text: "Overview", link: "/en/development/" },
                { text: "Architecture", link: "/en/development/architecture" },
                { text: "Contributing", link: "/en/development/contributing" },
                { text: "API Reference", link: "/en/development/api-reference" },
                { text: "Testing", link: "/en/development/testing" },
              ],
            },
          ],

          "/en/policies/": [
            {
              text: "Policies",
              items: [
                { text: "Overview", link: "/en/policies/" },
                { text: "Terms of Service", link: "/en/policies/terms-of-service" },
                { text: "Privacy Policy", link: "/en/policies/privacy-policy" },
                { text: "Data Processing Agreement", link: "/en/policies/dpa" },
                { text: "Acceptable Use Policy", link: "/en/policies/acceptable-use" },
                { text: "Early Access Program", link: "/en/policies/early-access-program" },
                { text: "Sample Wording", link: "/en/policies/sample-wording" },
              ],
            },
          ],
        },

        outline: {
          label: "On this page",
          level: [2, 3],
        },

        docFooter: {
          prev: "Previous",
          next: "Next",
        },

        lastUpdated: {
          text: "Last updated",
          formatOptions: {
            dateStyle: "short",
            timeStyle: "short",
          },
        },

        editLink: {
          pattern: `${DOC_VARS.GITHUB_REPO_URL}/edit/main/:path`,
          text: "Edit this page on GitHub",
        },
      },
    },
  },

  themeConfig: {
    logo: {
      light: "https://assets.choiceform.app/atomemo/logo-light.svg",
      dark: "https://assets.choiceform.app/atomemo/logo-dark.svg",
    },

    socialLinks: [{ icon: "github", link: DOC_VARS.GITHUB_REPO_URL }],

    search: {
      provider: "local",
      options: {
        locales: {
          "zh-hans": {
            translations: {
              button: {
                buttonText: "搜索",
                buttonAriaLabel: "搜索",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: "Search",
                buttonAriaLabel: "Search",
              },
              modal: {
                noResultsText: "No results found",
                resetButtonTitle: "Reset search",
                footer: {
                  selectText: "Select",
                  navigateText: "Navigate",
                  closeText: "Close",
                },
              },
            },
          },
        },
      },
    },
  },

  lastUpdated: true,

  mermaid: {},
})
