import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as reminders from "./reminders.js";

// Create a simple MCP server for Apple Reminders
const server = new McpServer({
  name: "apple-reminders",
  version: "1.0.0"
});

// Tool to get all reminder lists
server.tool(
  "getLists",
  {},
  async () => {
    try {
      const lists = await reminders.getRemindersLists();
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ lists }) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: "Failed to get reminder lists" }) 
        }],
        isError: true
      };
    }
  }
);

// Tool to get reminders from a specific list
server.tool(
  "getReminders",
  { listName: z.string() },
  async ({ listName }) => {
    try {
      const items = await reminders.getRemindersFromList(listName);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ reminders: items }) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: `Failed to get reminders from list: ${listName}` }) 
        }],
        isError: true
      };
    }
  }
);

// Tool to create a new reminder
server.tool(
  "createReminder",
  { 
    listName: z.string(),
    title: z.string(),
    dueDate: z.string().optional(),
    notes: z.string().optional()
  },
  async ({ listName, title, dueDate, notes }) => {
    try {
      const success = await reminders.createReminder(listName, title, dueDate, notes);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ success, message: success ? "Reminder created" : "Failed to create reminder" }) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: "Failed to create reminder" }) 
        }],
        isError: true
      };
    }
  }
);

// Tool to mark a reminder as completed
server.tool(
  "completeReminder",
  { 
    listName: z.string(),
    reminderName: z.string()
  },
  async ({ listName, reminderName }) => {
    try {
      const success = await reminders.completeReminder(listName, reminderName);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ success, message: success ? "Reminder marked as completed" : "Reminder not found" }) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: "Failed to complete reminder" }) 
        }],
        isError: true
      };
    }
  }
);

// Tool to delete a reminder
server.tool(
  "deleteReminder",
  { 
    listName: z.string(),
    reminderName: z.string()
  },
  async ({ listName, reminderName }) => {
    try {
      const success = await reminders.deleteReminder(listName, reminderName);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ success, message: success ? "Reminder deleted" : "Reminder not found" }) 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: "Failed to delete reminder" }) 
        }],
        isError: true
      };
    }
  }
);

// Start the server
async function runServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

runServer(); 