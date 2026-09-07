import { Inngest } from "inngest";

export type InngestEvents = {
  "tasks/assigned": {
    data: {
      taskId: string;
      taskTitle: string;
      assigneeEmail: string;
      assigneeName: string;
      assignerName: string;
      boardTitle: string;
    };
  };
  "tasks/due-reminder": {
    data: {
      taskId: string;
      taskTitle: string;
      dueDate: string;
      userEmail: string;
    };
  };
  "workspace/weekly-digest": {
    data: {
      workspaceId: string;
    };
  };
};

export const inngest = new Inngest({
  id: "kanban-lms",
  name: "Kanban LMS Task Manager",
});
