import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Execute an AppleScript command
 */
async function runAppleScript(script: string): Promise<string> {
  try {
    const { stdout } = await execPromise(`osascript -e '${script.replace(/'/g, "'\\''")}'`);
    return stdout.trim();
  } catch (error) {
    console.error('AppleScript execution error:', error);
    throw new Error(`Failed to execute AppleScript: ${error}`);
  }
}

/**
 * Get all reminder lists
 */
export async function getRemindersLists(): Promise<string[]> {
  const script = `
    tell application "Reminders"
      set listNames to {}
      repeat with aList in lists
        set end of listNames to name of aList
      end repeat
      return listNames
    end tell
  `;
  
  const result = await runAppleScript(script);
  return result.split(', ');
}

/**
 * Get reminders from a specific list
 */
export async function getRemindersFromList(listName: string): Promise<any[]> {
  const script = `
    tell application "Reminders"
      set reminderItems to {}
      set targetList to list "${listName}"
      set allReminders to reminders in targetList
      repeat with aReminder in allReminders
        set reminderName to name of aReminder
        set reminderCompleted to completed of aReminder
        set reminderDueDate to ""
        try
          set reminderDueDate to due date of aReminder as string
        end try
        set reminderPriority to priority of aReminder
        set end of reminderItems to reminderName & "|" & reminderCompleted & "|" & reminderDueDate & "|" & reminderPriority
      end repeat
      return reminderItems
    end tell
  `;
  
  const result = await runAppleScript(script);
  if (!result) return [];
  
  return result.split(', ').map(item => {
    const [name, completed, dueDate, priority] = item.split('|');
    return {
      name,
      completed: completed === 'true',
      dueDate: dueDate || null,
      priority: parseInt(priority) || 0
    };
  });
}

/**
 * Create a new reminder
 */
export async function createReminder(listName: string, title: string, dueDate?: string, notes?: string): Promise<boolean> {
  let script = `
    tell application "Reminders"
      tell list "${listName}"
        make new reminder with properties {name:"${title.replace(/"/g, '\\"')}"`;
  
  if (dueDate) {
    script += `, due date:date "${dueDate}"`;
  }
  
  if (notes) {
    script += `, body:"${notes.replace(/"/g, '\\"')}"`;
  }
  
  script += `}
      end tell
    end tell
    return true
  `;
  
  const result = await runAppleScript(script);
  return result === 'true';
}

/**
 * Mark a reminder as completed
 */
export async function completeReminder(listName: string, reminderName: string): Promise<boolean> {
  const script = `
    tell application "Reminders"
      tell list "${listName}"
        set theReminders to (reminders whose name is "${reminderName.replace(/"/g, '\\"')}")
        if length of theReminders > 0 then
          set completed of item 1 of theReminders to true
          return true
        else
          return false
        end if
      end tell
    end tell
  `;
  
  const result = await runAppleScript(script);
  return result === 'true';
}

/**
 * Delete a reminder
 */
export async function deleteReminder(listName: string, reminderName: string): Promise<boolean> {
  const script = `
    tell application "Reminders"
      tell list "${listName}"
        set theReminders to (reminders whose name is "${reminderName.replace(/"/g, '\\"')}")
        if length of theReminders > 0 then
          delete item 1 of theReminders
          return true
        else
          return false
        end if
      end tell
    end tell
  `;
  
  const result = await runAppleScript(script);
  return result === 'true';
} 