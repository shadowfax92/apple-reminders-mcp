# MCP Apple Reminders

A Model Context Protocol (MCP) server for interacting with Apple Reminders on macOS.

## Features

- **List Management**: View all reminder lists in your Apple Reminders app
- **Reminder Retrieval**: Get all reminders from a specific list
- **Create Reminders**: Create new reminders with titles, due dates, and notes
- **Complete Reminders**: Mark reminders as completed
- **Delete Reminders**: Remove reminders from your lists
- **Date Handling**: Proper handling of ISO date formats for due dates

## Configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "apple-reminders": {
      "command": "node",
      "args": [
        "/path/to/mcp-apple-reminders/dist/index.js"
      ]
    }
  }
}
```

### NPX (Coming Soon)

```json
{
  "mcpServers": {
    "apple-reminders": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-apple-reminders"
      ]
    }
  }
}
```

## API

The server exposes the following MCP tools for interacting with Apple Reminders:

### getLists
Returns all reminder lists.

### getReminders
Returns reminders from a specific list.
- Parameters:
  - `listName` (required): The name of the reminder list

### createReminder
Creates a new reminder.
- Parameters:
  - `listName` (required): The name of the reminder list
  - `title` (required): The title of the reminder
  - `dueDate` (optional): The due date for the reminder (ISO format: "YYYY-MM-DDTHH:MM:SS.sssZ")
  - `notes` (optional): Notes for the reminder

### completeReminder
Marks a reminder as completed.
- Parameters:
  - `listName` (required): The name of the reminder list
  - `reminderName` (required): The name of the reminder to complete

### deleteReminder
Deletes a reminder.
- Parameters:
  - `listName` (required): The name of the reminder list
  - `reminderName` (required): The name of the reminder to delete

## How It Works

This MCP server uses AppleScript to interact with the Apple Reminders app on macOS. It provides a standardized interface for AI assistants to manage reminders through the Model Context Protocol.

## Development

This project uses TypeScript and the MCP SDK. To extend functionality, modify the tools in `src/index.ts` and the AppleScript functions in `src/reminders.ts`.

## Requirements

- macOS (required for Apple Reminders integration)
- Node.js 16+
- Apple Reminders app configured with at least one list

## License

MIT 