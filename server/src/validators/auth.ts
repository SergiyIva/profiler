import { validator } from "./index.js";

export type AuthData = {
  email: string;
  password: string;
};
export const validateAuth = validator(
  ({ email, password }: AuthData) =>
    isValidEmail(email) && isValidPassword(password),
);

export const isValidEmail = (email: string) =>
  !!email && email.length < 301 && /^\S+@\S+\.+\w{2,10}$/.test(email);
export const isValidPassword = (password: string) =>
  !!password && password.length > 3 && password.length < 201;
