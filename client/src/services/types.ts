export type Gender = "male" | "female";
export type User = {
  _id: string;
  username: string;
  email?: string;
  birthday: string;
  gender?: Gender;
  avatar?: string;
};
export type UserFeed = {
  users: User[];
  total: number;
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  birthday: string;
  gender: Gender;
  avatar?: File;
};
export type ChangePasswordRequest = {
  password: string;
  newPassword: string;
};
export type UpdateUserRequest = {
  username: string;
  avatar?: File;
};
export type OkResponse = {
  message: string;
};
