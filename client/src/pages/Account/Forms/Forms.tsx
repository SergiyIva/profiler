import { AvaAndName } from "./AvaAndName/AvaAndName";
import { ChangePassword } from "./ChangePassword/ChangePassword";

type FormsProps = {
  username: string;
};
export const Forms = ({ username }: FormsProps) => {
  return (
    <div className={"account__forms"}>
      <AvaAndName username={username} />
      <ChangePassword />
    </div>
  );
};
