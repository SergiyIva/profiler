import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Forms } from "./Forms/Forms";

type AccountProps = {};
export const Account = ({}: AccountProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  useLayoutEffect(() => {
    document.title = "Аккаунт | Profiler";
  }, []);

  return (
    <div className={"account__wrapper"}>
      <h4 className={"account__heading"}>Аккаунт</h4>
      {user && <Forms username={user.username} />}
    </div>
  );
};
