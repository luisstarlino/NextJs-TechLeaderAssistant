
# 🤖 Tech Leader Assistant With AI 🤖

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat) ![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=flat&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) ![Genkit](https://img.shields.io/badge/Genkit%20(Gemini)-4285F4?style=flat&logo=google&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![ShadCN/UI](https://img.shields.io/badge/ShadCN/UI-000000?style=flat&logo=shadcn-ui&logoColor=white)

## 📖 Sobre

**AI Leadership Dashboard** is a task management dashboard designed for technical leaders, powered by the **Google Gemini** model through **Genkit**. The platform allows you to create, update and analyze tasks using natural language commands, with all data securely stored in **Firebase Firestore**.

This project demonstrates how generative AI can be integrated into productivity applications to optimize workflow, automate task creation, and generate visual insights, such as mind maps, from existing data.

## 🚀 Features

- **✨ AI Task Creation:** Create new detailed tasks using NPL[natural language] (e.g., “New task: create login...”).
- **🔄 Status Update with AI:** Change the status of a task with a simple text command.
- **🧠 Visual Analysis with AI:** Generate mind maps of your tasks for strategic visualization.
- **🔥 Real-Time Synchronization:** Tasks are synchronized in real time with Firestore.
- **🔒 Secure Authentication:** User management with Firebase Authentication.
- **📊 Data Export:** Export your task list to CSV and PDF formats.

---

## 🛠️ Technologies

- **[Next.js 15](https://nextjs.org/)** 🖥️: React framework for building fast, optimized interfaces with App Router.
- **[Firebase](https://firebase.google.com/)** 🔥: Complete backend with Firestore for NoSQL databases and Authentication for user management.
- **[Genkit](https://firebase.google.com/docs/genkit)** 🤖: Google framework for building applications with generative AI, using the Gemini model.
- **[TypeScript](https://www.typescriptlang.org/)** 🔷: JavaScript superset that adds static typing for greater code robustness.
- **[TailwindCSS](https://tailwindcss.com/)** 🎨: Utility-first CSS framework for agile and modern styling.
- **[ShadCN/UI](https://ui.shadcn.com/)** 🧩: Collection of reusable UI components built with Radix UI and Tailwind CSS.
- **[Mermaid.js](https://mermaid-js.github.io/mermaid/#/)** 📈: Library for generating diagrams and flowcharts from text in Markdown-like syntax.

---

## ⚙️ How to Execute the Project

### 🧰 Requirements
- Node.js v18+
- NPM ou Yarn

### 📥 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/luisstarlino/NextJs-TechLeaderAssistant
   cd NextJs-TechLeaderAssistant
   ```

2. Install the packages:
   ```bash
   npm install
   # or
   yarn install
   ```

### ▶️ Run
Start the development server:
```bash
npm run dev
```
The project run into: [http://localhost:9002](http://localhost:9002)

---

## 📂 Project Structure
```
📁 src
├── 📂 app            # Application pages (App Router)
│   ├── 📂 (app)      # Authenticated routes (dashboard, mind-map)
│   ├── login
│   └── signup
├── 📂 ai             # AI logic with Genkit
│   └── 📂 flows      # AI flows for tasks and analysis
├── 📂 components     # Reusable React components
│   ├── 📂 chat       # AI chat panel components
│   ├── 📂 layout     # Structure components (Header, Sidebar)
│   ├── 📂 tasks      # Components for the task dashboard
│   └── 📂 ui         # ShadCN/UI base components
├── 📂 context        # React context providers
├── 📂 firebase       # Firebase configuration, providers, and hooks
└── 📂 lib            # Utility and service functions
```