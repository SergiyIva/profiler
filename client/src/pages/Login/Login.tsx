import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useLayoutEffect, useState } from "react";
import { SignIn } from "../../components/SignIn/SignIn";
import { SignUp } from "../../components/SignUp/SignUp";

export type FormType = "signin" | "signup";
export const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formType, setFormType] = useState<FormType>("signin");

  useEffect(() => {
    if (user) navigate("/people");
  }, [user]);
  useLayoutEffect(() => {
    document.title = "Вход | Profiler";
  }, []);

  return (
    <div className={"login__wrapper"}>
      <h2 className={"login__heading"}>
        {formType === "signup" ? "Регистрация" : "Вход"}
      </h2>
      {formType === "signup" ? (
        <SignUp toggleFormType={() => setFormType("signin")} />
      ) : (
        <SignIn toggleFormType={() => setFormType("signup")} />
      )}
    </div>
  );
};
