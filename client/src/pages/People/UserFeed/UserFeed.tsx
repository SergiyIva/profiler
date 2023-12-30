import { User } from "../../../services/types";
import { Card } from "./Card/Card";

type UserFeedProps = {
  users: User[];
};
export const UserFeed = ({ users }: UserFeedProps) => {
  return (
    <div className={"people__wrapper"}>
      {users.map((user) => (
        <Card key={user._id} user={user} />
      ))}
    </div>
  );
};
