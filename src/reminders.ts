import * as reminders from 'node-reminders';

/**
 * Format a date string for consistency
 */
function formatDate(date: Date | string | null): string | null {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
}

/**
 * Get all reminder lists
 */
export async function getRemindersLists(): Promise<string[]> {
  try {
    const lists = await reminders.getLists();
    return lists.map(list => list.name);
  } catch (error) {
    console.error('Failed to get reminder lists:', error);
    throw new Error(`Failed to get reminder lists: ${error}`);
  }
}

/**
 * Get reminders from a specific list
 */
export async function getRemindersFromList(listName: string): Promise<any[]> {
  try {
    // First get the list ID by name
    const lists = await reminders.getLists();
    const targetList = lists.find(list => list.name === listName);
    
    if (!targetList) {
      throw new Error(`List "${listName}" not found`);
    }
    
    // Get reminders from the list with specific properties
    const reminderItems = await reminders.getReminders(
      targetList.id,
      ['name', 'completed', 'dueDate', 'priority', 'body']
    );
    
    // Format the reminders to match the expected output format
    return reminderItems.map(item => ({
      name: item.name,
      completed: item.completed || false,
      dueDate: formatDate(item.dueDate),
      priority: item.priority || 0,
      notes: item.body
    }));
  } catch (error) {
    console.error(`Failed to get reminders from list "${listName}":`, error);
    throw new Error(`Failed to get reminders from list "${listName}": ${error}`);
  }
}

/**
 * Create a new reminder
 */
export async function createReminder(listName: string, title: string, dueDate?: string, notes?: string): Promise<boolean> {
  try {
    // First get the list ID by name
    const lists = await reminders.getLists();
    const targetList = lists.find(list => list.name === listName);
    
    if (!targetList) {
      throw new Error(`List "${listName}" not found`);
    }
    
    // Prepare reminder data
    const reminderData: any = {
      name: title
    };
    
    if (dueDate) {
      reminderData.dueDate = new Date(dueDate);
    }
    
    if (notes) {
      reminderData.body = notes;
    }
    
    // Create the reminder
    const newReminderId = await reminders.createReminder(targetList.id, reminderData);
    
    return !!newReminderId;
  } catch (error) {
    console.error(`Failed to create reminder "${title}" in list "${listName}":`, error);
    throw new Error(`Failed to create reminder: ${error}`);
  }
}

/**
 * Mark a reminder as completed
 */
export async function completeReminder(listName: string, reminderName: string): Promise<boolean> {
  try {
    // First get the list ID by name
    const lists = await reminders.getLists();
    const targetList = lists.find(list => list.name === listName);
    
    if (!targetList) {
      throw new Error(`List "${listName}" not found`);
    }
    
    // Get all reminders from the list
    const reminderItems = await reminders.getReminders(
      targetList.id,
      ['name', 'id']
    );
    
    // Find the specific reminder by name
    const targetReminder = reminderItems.find(item => item.name === reminderName);
    
    if (!targetReminder) {
      return false; // Reminder not found
    }
    
    // Update the reminder to mark it as completed
    await reminders.updateReminder(targetReminder.id, {
      completed: true
    });
    
    return true;
  } catch (error) {
    console.error(`Failed to complete reminder "${reminderName}" in list "${listName}":`, error);
    throw new Error(`Failed to complete reminder: ${error}`);
  }
}

/**
 * Delete a reminder
 */
export async function deleteReminder(listName: string, reminderName: string): Promise<boolean> {
  try {
    // First get the list ID by name
    const lists = await reminders.getLists();
    const targetList = lists.find(list => list.name === listName);
    
    if (!targetList) {
      throw new Error(`List "${listName}" not found`);
    }
    
    // Get all reminders from the list
    const reminderItems = await reminders.getReminders(
      targetList.id,
      ['name', 'id']
    );
    
    // Find the specific reminder by name
    const targetReminder = reminderItems.find(item => item.name === reminderName);
    
    if (!targetReminder) {
      return false; // Reminder not found
    }
    
    // Delete the reminder
    await reminders.deleteReminder(targetReminder.id);
    
    return true;
  } catch (error) {
    console.error(`Failed to delete reminder "${reminderName}" in list "${listName}":`, error);
    throw new Error(`Failed to delete reminder: ${error}`);
  }
} 