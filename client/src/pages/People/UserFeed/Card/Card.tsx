import { User } from "../../../../services/types";
import anon from "../../../../assets/anon.png";

type CardProps = {
  user: User;
};
export const Card = ({ user }: CardProps) => {
  return (
    <div className={"people__card-wrapper"}>
      <img
        src={user.avatar ? process.env.REACT_APP_HOST + user.avatar : anon}
        alt={`Аватар ${user.username}`}
        loading={"lazy"}
        decoding={"async"}
      />
      <div className={"info"}>
        <div className={"flex-divider"}>
          <div>Имя:</div>
          <div>{user.username}</div>
        </div>
        <div className={"flex-divider"}>
          <div>Возраст:</div>
          <div>{calculateAge(user.birthday)}</div>
        </div>
      </div>
    </div>
  );
};

const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday);
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  if (
    now.getMonth() < birthDate.getMonth() ||
    (now.getMonth() == birthDate.getMonth() &&
      now.getDate() < birthDate.getDate())
  ) {
    years -= 1;
  }

  return years;
};
