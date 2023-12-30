import { User as UserType } from "../../../../../services/types";

type UserProps = {
  user: UserType;
};
export const User = ({ user }: UserProps) => {
  return <div>Здравствуйте, {user.username}</div>;
};
