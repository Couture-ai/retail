import { ChatData } from "@/types";

export const mockChats: ChatData[] = [
  {
    channelId: "clever-fox-3721",
    messages: [
      {
        id: "1",
        content: "Hello! I'm Clever Fox, your primary assistant. How can I help you orchestrate your project today?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 600000),
        botName: "clever-fox-3721"
      },
      {
        id: "2",
        content: "I need help building a solar system simulator app. Can you help me plan it out?",
        sender: "user",
        timestamp: new Date(new Date().getTime() - 480000),
        userName: "User"
      },
      {
        id: "3",
        content: "Certainly! Building a solar system simulator sounds fascinating. Let's break down the key components:\n\n**Core Features:**\n- Interactive 3D visualization of planets\n- Realistic orbital mechanics\n- Displaying educational information about each celestial body\n- Time controls (speed up/slow down)\n\n**Potential Technologies:**\n- Frontend: React, Three.js (for 3D)\n- Data: Simple JSON files for planet info initially\n\nWould you like me to coordinate with the Code Helper bot (swift-eagle-9042) to set up the basic project structure?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 420000),
        botName: "clever-fox-3721"
      },
      {
        id: "4",
        content: "Yes, please coordinate with swift-eagle-9042 for the setup.",
        sender: "user",
        timestamp: new Date(new Date().getTime() - 180000),
        userName: "User"
      },
    ]
  },
  {
    channelId: "swift-eagle-9042",
    messages: [
      {
        id: "1",
        content: "Greetings! I am Swift Eagle, your Code Helper AI. I can assist with code generation, debugging, and technical implementation. How may I assist?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 60000),
        botName: "swift-eagle-9042"
      },
      {
        id: "2",
        content: "Directive from clever-fox-3721: Set up a basic React + Three.js project structure for a solar system simulator.",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 55000),
        botName: "(System Directive)"
      },
      {
        id: "3",
        content: "Project structure initialized. Repository available at `solar-system-simulator`. Includes basic React setup and Three.js dependency.",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 50000),
        botName: "swift-eagle-9042"
      }
    ]
  },
  {
    channelId: "creative-owl-7238",
    messages: [
      {
        id: "1",
        content: "Hoot! Creative Owl here. I specialize in UI/UX design, component creation, and visual refinement. What design challenges can we tackle?",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 40000),
        botName: "creative-owl-7238"
      }
    ]
  },
  {
    channelId: "precise-deer-5190",
    messages: [
      {
        id: "1",
        content: "Precise Deer reporting. I handle data analysis, visualization, and database interactions. Provide me with data or analysis tasks.",
        sender: "bot",
        timestamp: new Date(new Date().getTime() - 30000),
        botName: "precise-deer-5190"
      }
    ]
  }
];
