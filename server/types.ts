export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  assigned_user: string;
  createdAt: number;
  updatedAt: number;
}

enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
