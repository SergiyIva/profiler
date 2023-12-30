import { Link } from "react-router-dom";
import { User } from "./User/User";
import { User as UserType } from "../../../../services/types";
import { useLayoutEffect } from "react";
import { useLazyGetUserQuery } from "../../../../services/api";
import { setAuth } from "../../../../features/auth/authSlice";
import { useAppDispatch } from "../../../../hooks/store";

type LogAngSignProps = {
  user?: UserType;
  logOut: () => void;
};
export const LogAndSign = ({ user, logOut }: LogAngSignProps) => {
  const [getMe, { isLoading }] = useLazyGetUserQuery();
  const dispatch = useAppDispatch();
  const fetch = async () => {
    try {
      const user = await getMe({}).unwrap();
      dispatch(setAuth({ user }));
      localStorage.setItem("isAuth", "true");
    } catch (err) {
      console.log(err);
    }
  };
  useLayoutEffect(() => {
    if (!!localStorage.getItem("isAuth") && !user) {
      fetch();
    }
  }, []);
  return (
    <div className={"header__user"}>
      {isLoading ? (
        "Загрузка..."
      ) : user ? (
        <div className={"flex-gap gap-1"}>
          <User user={user} />
          <button className={"button-like-link"} onClick={logOut}>
            Выйти
          </button>
        </div>
      ) : (
        <div className={"flex-gap"}>
          <Link to={"/"}>Войти</Link>
        </div>
      )}
    </div>
  );
};
