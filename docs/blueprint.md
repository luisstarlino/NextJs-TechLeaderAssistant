# **App Name**: Tech Leader Assistant

## Core Features:

- Task Creation via Natural Language: Create new tasks by providing a description, responsible person, deadline, and project using natural language.
- Task Status Updates: Update the status of existing tasks using natural language commands. Status will be updated in the Firestore database.
- Real-time Task List: Display a real-time list of tasks fetched from Firestore, showing project, task description, responsible person, deadline, and status.
- AI-Powered Task Analysis and Summarization: Generate task analysis, mind maps, or lists of pending tasks using generative AI based on the current task list. The tool will use reasoning to include tasks from the task list as part of its answer.
- Data persistence on Firestore: Save task data (project, task, responsible, status, deadline, last update, observations) to Firestore database for persistence.
- User Authentication: Authenticate users either anonymously or via a custom token, managing access to their task lists in Firestore.
- Error Handling: Display error messages when issues occur during API calls or data processing, providing feedback to the user.

## Style Guidelines:

- Primary color: Indigo (#4F46E5), representing leadership and intelligence.
- Background color: Light gray (#F9FAFB), providing a clean and modern backdrop.
- Accent color: Purple (#A3A4FF) to highlight interactive elements and calls to action.
- Body text: 'Inter', a sans-serif font for clean readability. Headlines: 'Space Grotesk' for a modern, slightly techy feel.
- Code Font: 'Source Code Pro' for inline code snippets.
- Use Lucide React icons for a consistent and modern look.
- Subtle loading animations and transitions to enhance user experience.