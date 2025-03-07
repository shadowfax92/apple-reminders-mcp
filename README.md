# MCP Apple Reminders

A Model Context Protocol (MCP) server for interacting with Apple Reminders on macOS.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

2. Build the project:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

3. Run the server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

For development:
```
npm run dev
```
or
```
yarn dev
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
  - `dueDate` (optional): The due date for the reminder (format: "YYYY-MM-DD HH:MM:SS")
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

## License

MIT 