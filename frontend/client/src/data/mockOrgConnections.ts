import { BotConnection } from "@/types";

export const mockOrgConnections: BotConnection[] = [
  // CEO to VPs (directives)
  {
    id: "conn-1",
    source: "bot-1",
    target: "bot-2",
    type: "directive"
  },
  {
    id: "conn-2",
    source: "bot-1",
    target: "bot-3",
    type: "directive"
  },
  
  // VPs to Managers (directives)
  {
    id: "conn-3",
    source: "bot-2",
    target: "bot-4",
    type: "directive"
  },
  {
    id: "conn-4",
    source: "bot-2",
    target: "bot-5",
    type: "directive"
  },
  {
    id: "conn-5",
    source: "bot-3",
    target: "bot-6",
    type: "directive"
  },
  
  // Managers to Developers (directives)
  {
    id: "conn-6",
    source: "bot-4",
    target: "bot-7",
    type: "directive"
  },
  {
    id: "conn-7",
    source: "bot-4",
    target: "bot-8",
    type: "directive"
  },
  {
    id: "conn-8",
    source: "bot-5",
    target: "bot-9",
    type: "directive"
  },
  {
    id: "conn-9",
    source: "bot-5",
    target: "bot-10",
    type: "directive"
  },
  
  // Communication channels (across teams)
  {
    id: "comm-1",
    source: "bot-7",
    target: "bot-9",
    type: "communication"
  },
  {
    id: "comm-2",
    source: "bot-8",
    target: "bot-10",
    type: "communication"
  },
  {
    id: "comm-3",
    source: "bot-4",
    target: "bot-6",
    type: "communication"
  },
  {
    id: "comm-4",
    source: "bot-2",
    target: "bot-3",
    type: "communication"
  }
];