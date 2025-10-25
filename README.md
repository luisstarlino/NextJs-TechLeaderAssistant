
# 🤖 Painel de Liderança com IA 🤖

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat) ![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=flat&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) ![Genkit](https://img.shields.io/badge/Genkit%20(Gemini)-4285F4?style=flat&logo=google&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![ShadCN/UI](https://img.shields.io/badge/ShadCN/UI-000000?style=flat&logo=shadcn-ui&logoColor=white)

## 📖 Sobre

**Painel de Liderança com IA** é um dashboard de gerenciamento de tarefas projetado para líderes técnicos, potencializado pelo modelo **Google Gemini** através do **Genkit**. A plataforma permite a criação, atualização e análise de tarefas usando comandos de linguagem natural, com todos os dados persistidos de forma segura no **Firebase Firestore**.

Este projeto demonstra como a IA generativa pode ser integrada em aplicações de produtividade para otimizar o fluxo de trabalho, automatizar a criação de tarefas e gerar insights visuais, como mapas mentais, a partir de dados existentes.

## 🚀 Funcionalidades

- **✨ Criação de Tarefas com IA:** Crie novas tarefas detalhadas usando linguagem natural (ex: "Nova tarefa: criar login...").
- **🔄 Atualização de Status com IA:** Altere o status de uma tarefa com um simples comando de texto.
- **🧠 Análise Visual com IA:** Gere mapas mentais (Mind Maps) de suas tarefas para uma visualização estratégica.
- **🔥 Sincronização em Tempo Real:** As tarefas são sincronizadas em tempo real com o Firestore.
- **🔒 Autenticação Segura:** Gerenciamento de usuários com o Firebase Authentication.
- **📊 Exportação de Dados:** Exporte sua lista de tarefas para os formatos CSV e PDF.

---

## 🛠️ Tecnologias

- **[Next.js 15](https://nextjs.org/)** 🖥️: Framework React para construir interfaces rápidas e otimizadas com App Router.
- **[Firebase](https://firebase.google.com/)** 🔥: Backend completo com Firestore para banco de dados NoSQL e Authentication para gerenciamento de usuários.
- **[Genkit](https://firebase.google.com/docs/genkit)** 🤖: Framework da Google para construir aplicações com IA generativa, utilizando o modelo Gemini.
- **[TypeScript](https://www.typescriptlang.org/)** 🔷: Superset do JavaScript que adiciona tipagem estática para maior robustez do código.
- **[TailwindCSS](https://tailwindcss.com/)** 🎨: Framework de CSS utility-first para estilização ágil e moderna.
- **[ShadCN/UI](https://ui.shadcn.com/)** 🧩: Coleção de componentes de UI reusáveis, construídos com Radix UI e Tailwind CSS.
- **[Mermaid.js](https://mermaid-js.github.io/mermaid/#/)** 📈: Biblioteca para gerar diagramas e fluxogramas a partir de texto em sintaxe similar a Markdown.

---

## ⚙️ Como Executar o Projeto

### 🧰 Pré-requisitos
- Node.js v18+
- NPM ou Yarn

### 📥 Instalação
1. Clone o repositório:
   ```bash
   git clone [URL_DO_SEU_REPOSITORIO]
   cd [NOME_DO_PROJETO]
   ```

2. Instale os Pacotes:
   ```bash
   npm install
   # ou
   yarn install
   ```

### ▶️ Executar
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O projeto estará disponível em: [http://localhost:9002](http://localhost:9002)

---

## 📂 Estrutura do Projeto
```
📁 src
├── 📂 app            # Páginas da aplicação (App Router)
│   ├── 📂 (app)      # Rotas autenticadas (dashboard, mind-map)
│   ├── login
│   └── signup
├── 📂 ai             # Lógica de IA com Genkit
│   └── 📂 flows      # Fluxos de IA para tarefas e análises
├── 📂 components     # Componentes React reutilizáveis
│   ├── 📂 chat       # Componentes do painel de chat com IA
│   ├── 📂 layout     # Componentes de estrutura (Header, Sidebar)
│   ├── 📂 tasks      # Componentes para o dashboard de tarefas
│   └── 📂 ui         # Componentes base do ShadCN/UI
├── 📂 context        # Provedores de contexto React
├── 📂 firebase       # Configuração, providers e hooks do Firebase
└── 📂 lib            # Funções utilitárias e de serviço
```
