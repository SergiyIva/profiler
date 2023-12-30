import { validator } from "./index.js";
import { AuthData, isValidEmail, isValidPassword } from "./auth.js";

type UserData = {
  username: string;
  birthday: string;
  gender: string;
} & AuthData;
type UpdateData = {
  username: string;
};
type PasswordData = {
  password: string;
  newPassword: string;
};
export const validateUser = validator(
  ({ email, password, username, birthday, gender }: UserData) =>
    isValidEmail(email) &&
    isValidPassword(password) &&
    isValidGender(gender) &&
    isValidUsername(username) &&
    isValidBirthday(birthday),
);

export const validateUserUpdate = validator(({ username }: UpdateData) =>
  isValidUsername(username),
);

export const validatePasswordUpdate = validator(
  ({ password, newPassword }: PasswordData) =>
    isValidPassword(password) && isValidPassword(newPassword),
);

const isValidUsername = (username: string) =>
  (!!username && username.length < 201 && /\w/.test(username)) ||
  /\p{Script=Cyrillic}/u.test(username);

const isValidGender = (gender: string) =>
  gender === "male" || gender === "female";

const isValidBirthday = (birthday: string) => {
  const date = new Date(birthday);
  return !isNaN(date.getTime());
};
