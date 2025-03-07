import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create a simple MCP server for Apple Reminders
const server = new McpServer({
  name: "apple-reminders",
  version: "1.0.0"
});

// Define a simple tool that just returns hello
server.tool(
  "hello",
  { message: z.string().optional() },
  async ({ message }) => ({
    content: [{ 
      type: "text", 
      text: `Hello from Apple Reminders MCP! ${message ? `You said: ${message}` : ''}` 
    }]
  })
);

// Start the server
async function runServer() {
  try {
    console.log("Starting Apple Reminders MCP server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Apple Reminders MCP server is running");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

runServer(); 