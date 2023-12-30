import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogAndSign } from "./LogAndSign/LogAngSign";
import { FaUserAstronaut } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { setAuth, setNoAuth } from "../../../features/auth/authSlice";
import { useAppDispatch } from "../../../hooks/store";
import { useLogoutMutation } from "../../../services/api";

export const Header = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const logOut = async () => {
    const res = await logout({}).unwrap();
    if (res.message === "ok") {
      dispatch(setNoAuth());
      localStorage.removeItem("isAuth");
      if (location.pathname === "/account") navigate("/");
    }
  };
  return (
    <header>
      <Link className={"logo flex-gap"} to={"/people"}>
        <FaUserAstronaut />
        Profiler
      </Link>
      <LogAndSign user={user} logOut={logOut} />
    </header>
  );
};
