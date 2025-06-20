export type ChecklistItem = {
  id: string;
  userId: string;
  groupId: string; // Foreign key to ChecklistGroup
  title: string;
  notes?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
};
