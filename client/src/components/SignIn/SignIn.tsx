import { useLoginMutation } from "../../services/api";
import { useState } from "react";
import { Messages, validation } from "../../utils/validation";
import { useFormInput } from "../../hooks/useFormInput";
import { setAuth } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/store";
import { Loader } from "../Loader/Loader";

export type SignProps = {
  toggleFormType: () => void;
};
export const SignIn = ({ toggleFormType }: SignProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [signIn, { isLoading, error }] = useLoginMutation();
  const [validationMessage, setMessage] = useState<Messages | string>("");
  const [values] = useFormInput({
    email: "",
    password: "",
  });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validFn = validation();
    const msg = validFn(values.value);
    if (!msg.isValid) {
      setMessage(msg);
      return;
    }
    try {
      const user = await signIn(values.value).unwrap();
      dispatch(setAuth({ user }));
      localStorage.setItem("isAuth", "true");
      if (location.state === null) navigate("/people", { replace: true });
      else navigate(location.state.from, { replace: true });
    } catch (err) {
      console.log(err);
      setMessage("Ошибка при попытке авторизации");
    }
  };

  if (isLoading) return <Loader />;
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={"email"}>Email:</label>
      <input
        required
        type={"text"}
        id={"email"}
        name={"email"}
        placeholder={"Email пользователя"}
        value={values.value.email}
        onChange={values.onChange}
      />
      {typeof validationMessage !== "string" &&
        validationMessage.email &&
        validationMessage.email !== "isValid" && (
          <div className={"error"}>{validationMessage.email}</div>
        )}
      <label htmlFor={"password"}>Пароль:</label>
      <input
        required
        type={"password"}
        id={"password"}
        name={"password"}
        placeholder={"Пароль"}
        value={values.value.password}
        onChange={values.onChange}
      />
      {typeof validationMessage !== "string" &&
        validationMessage.password &&
        validationMessage.password !== "isValid" && (
          <div className={"error"}>{validationMessage.password}</div>
        )}
      {typeof validationMessage === "string" && (
        <div className={"error"}>{validationMessage}</div>
      )}
      <div className={"btn-wrapper"}>
        <button className={"btn"} type={"submit"}>
          Отправить
        </button>
        <button
          className={"button-like-link mt-1"}
          onClick={(e) => {
            e.preventDefault();
            toggleFormType();
          }}
        >
          Регистрация
        </button>
      </div>
    </form>
  );
};
