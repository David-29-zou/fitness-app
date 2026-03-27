🚀 12周极限双轨开发计划：从零到 AI Agent 开发者
目标： 在 2026年6月中旬前，利用 Vibe Coding 模式（AI辅助）上线两款 Web App。

App 1 (传统 CRUD 应用): 个人健身训练记录

App 2 (AI 赋能应用): 基于大模型与 MCP 协议的 Agent 软件
技术栈： Next.js (React), Tailwind CSS, Supabase (PostgreSQL), Vercel, LLM APIs, Vercel AI SDK, MCP.

📂 阶段一：App 1 健身记录 (基础架构与传统流) - Week 1 to 4
本阶段目标是通过开发一个 MVP（最小可行性产品）级别的健身记录器，掌握现代 Web 开发的核心骨架。

🗓️ Week 1: 界面搭建与组件化 (Component-Based Architecture)
核心概念： 告别面条代码，将 UI 拆分为独立的、可复用的乐高积木（React Components）。

Vibe Coding 任务：

初始化 Next.js 项目并配置 Tailwind CSS。

让 AI 生成 WorkoutForm (输入表单组件：日期、动作、重量、组数、次数)。

让 AI 生成 HistoryList (历史记录展示组件) 和 Header (导航栏)。

在主页面 (page.tsx) 中组装这些组件。

博客交付： “告别面条代码：我是如何用React组件拆解健身App界面的（附UI截图）”

🗓️ Week 2: 数据流转与状态管理 (State & Data Flow)
核心概念： 理解 React 的 useState，以及数据如何在父子组件之间单向流动。

Vibe Coding 任务：

在组件中绑定输入框的值（受控组件）。

实现点击“保存”时，将表单数据更新到本地的状态数组中。

让 HistoryList 实时渲染最新的状态数据（此时刷新页面数据仍会丢失）。

博客交付： “让网页活起来：图解React中的State与数据流向”

🗓️ Week 3: 云端持久化与前后端分离 (Client-Server & API)
核心概念： 前端（浏览器）与后端（数据库）解耦，通过 API 进行异步通信。

Vibe Coding 任务：

在 Supabase 中创建 workouts 数据表。

安装 Supabase 客户端，配置环境变量。

让 AI 编写数据插入（Insert）和查询（Select）的逻辑，替换掉第二周的本地状态。

处理加载状态（Loading）和基础错误提示。

博客交付： “点餐与后厨：通过接入Supabase理解前后端分离与API交互”

🗓️ Week 4: 版本控制与自动化部署 (Git & CI/CD)
核心概念： 用 Git 管理代码的生命周期，用 Vercel 实现持续集成与部署。

Vibe Coding 任务：

创建 GitHub 仓库并提交所有代码。

在 Vercel 中导入仓库，配置环境变量，一键部署到公网。

进行移动端真机测试，修复 UI 响应式 Bug。

博客交付： 【里程碑 1】App 1 健身记录上线！分享链接与四周踩坑总结。

📂 阶段二：AI 技术攻坚 (Agent 核心引擎) - Week 5 to 7
本阶段目标是脱离具体的业务逻辑，纯粹为了 App 2 储备 AI 相关的后端与接口调用能力。

🗓️ Week 5: LLM API 接入与 Prompt 引擎 (API Integration)
核心概念： 系统提示词（System Prompt）、Token 限制、流式输出（Streaming）。

Vibe Coding 任务：

申请大模型 API Key。

在 Next.js 中创建基础的 API Route，实现一个简单的对话接口。

利用 Vercel AI SDK 实现打字机效果的流式响应。

博客交付： “不只是聊天：如何用代码精确控制大模型的输出流”

🗓️ Week 6: 函数调用与技能赋予 (Function Calling / Skills)
核心概念： 结构化输出（JSON），让大模型根据意图执行本地代码逻辑。

Vibe Coding 任务：

定义 1-2 个基础 Tool（例如：获取当前时间、模拟查询天气）。

修改 API 逻辑，让 LLM 能够识别并触发这些 Tools，并将结果返回给 LLM 生成最终回答。

博客交付： “赋予AI手脚：Function Calling原理解析与实战”

🗓️ Week 7: MCP 协议深度实践 (Model Context Protocol)
核心概念： MCP 客户端与服务端的通信机制，标准化地接入外部资源。

Vibe Coding 任务：

阅读并理解 MCP 官方文档。

在本地搭建一个极简的 MCP Server（例如读取指定文件夹下的文本文件）。

在你的 Web App 后端（Client 端）连接该 MCP Server 并进行交互测试。

博客交付： “连接一切：我如何利用MCP协议让Agent读取我的本地文件”

📂 阶段三：App 2 Agent 软件 (复杂业务流) - Week 8 to 12
将前七周的传统工程能力与 AI 引擎结合，落地你的第二款核心应用（建议：利用 MCP 和 Skills 实现特定领域的 Research Agent 或自动化助手）。

🗓️ Week 8: App 2 架构设计与会话 UI (Conversational UI)
核心概念： 复杂前端状态的维护，聊天界面的滚动与渲染优化。

Vibe Coding 任务：

复用第一阶段的经验，搭建 App 2 的基础框架和数据库表（用户表、会话表、消息表）。

让 AI 生成类似 ChatGPT 的左侧历史会话侧边栏 + 右侧主对话区 UI。

博客交付： “站在巨人的肩膀上：App 2 架构设计与复用”

🗓️ Week 9: 核心逻辑接入与记忆持久化 (Context & Memory)
核心概念： 上下文窗口管理，如何将历史对话与系统指令拼接发送给 LLM。

Vibe Coding 任务：

打通前端 UI 与后端的 LLM API。

将每次对话的 Message 保存至 Supabase。

实现加载历史会话时，能够恢复之前的上下文。

博客交付： “让AI记住你：Agent上下文记忆的数据库实现方案”

🗓️ Week 10: Project 级功能与复杂状态管理 (Workflow State)
核心概念： 异步任务的生命周期（Pending, Processing, Completed, Failed）。

Vibe Coding 任务：

将第六/七周的 Skills 和 MCP 彻底融入 App 2。

在前端界面上，将 AI 调用工具的“思考过程”或“执行步骤”可视化（类似 Claude 的思考折叠面板）。

博客交付： “掀开黑盒：如何将Agent的思考与工具调用过程可视化”

🗓️ Week 11: 边界测试与异常处理 (Error Handling & Edge Cases)
核心概念： 防御性编程，处理 API 超时、模型幻觉、Token 超限。

Vibe Coding 任务：

故意制造网络断开或 API 报错，让 AI 生成优雅的错误提示 UI。

增加重试（Retry）机制。

优化加载动画和整体使用体验。

博客交付： “当AI罢工时：如何优雅地处理大模型应用的各种报错”

🗓️ Week 12: 最终部署与全面上线 (The Final Polish)
核心概念： 生产环境配置，产品发布与文档撰写。

Vibe Coding 任务：

部署 App 2 至 Vercel，绑定独立域名（可选）。

撰写清晰的 README 或用户操作指南。

全面回顾这 12 周的代码结构。

博客交付： 【终极里程碑】双App上线总结：12周从零到AI Agent开发者的蜕变！