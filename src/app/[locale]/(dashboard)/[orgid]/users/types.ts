export interface UserWithRole {
  id: string;
  name: string | null;
  email: string;
  role: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
}