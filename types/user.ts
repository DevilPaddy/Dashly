export interface User {
  _id: string;
  email: string;
  name?: string;
  picture?: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}