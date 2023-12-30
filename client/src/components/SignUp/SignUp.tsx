import { SignProps } from "../SignIn/SignIn";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/store";
import { useRegisterMutation } from "../../services/api";
import { MutableRefObject, useRef, useState } from "react";
import { Messages, validation } from "../../utils/validation";
import { useFormInput } from "../../hooks/useFormInput";
import { setAuth } from "../../features/auth/authSlice";
import { Loader } from "../Loader/Loader";
import { Gender } from "../../services/types";
import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types";
import "react-calendar/dist/Calendar.css";
import { compress } from "../../utils/compress";
import { upload } from "@testing-library/user-event/dist/upload";
import { AvatarInput } from "../AvatarInput/AvatarInput";

const genders = [
  {
    id: "male",
    name: "Мужской",
  },
  {
    id: "female",
    name: "Женский",
  },
];
export const SignUp = ({ toggleFormType }: SignProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [signUp, { isLoading, error }] = useRegisterMutation();
  const [validationMessage, setMessage] = useState<Messages | string>("");
  const [values, _, hardSet] = useFormInput({
    email: "",
    password: "",
    repeatPassword: "",
    username: "",
    gender: "",
  });
  const [birthday, setBirthday] = useState<Value>();
  const [photoUpload, setPhotoUpload] = useState<null | File>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validFn = validation();
    const msg = validFn(values.value);
    if (!birthday) return;
    if (!msg.isValid) {
      setMessage(msg);
      return;
    }
    try {
      const formData = new FormData();
      let avatar;
      if (photoUpload) {
        avatar = await compress(photoUpload);
        if (avatar) formData.append("avatar", avatar);
      }
      formData.append("email", values.value.email);
      formData.append("password", values.value.password);
      formData.append("username", values.value.username);
      formData.append("gender", values.value.gender);
      formData.append("birthday", new Date(birthday.toString()).toISOString());
      const user = await signUp(formData).unwrap();
      dispatch(setAuth({ user }));
      localStorage.setItem("isAuth", "true");
      if (location.state === null) navigate("/people", { replace: true });
      else navigate(location.state.from, { replace: true });
    } catch (err) {
      console.log(err);
      setMessage("Ошибка при попытке регистрации");
    }
  };

  if (isLoading) return <Loader />;
  return (
    <form onSubmit={onSubmit}>
      <AvatarInput photoUpload={photoUpload} setPhotoUpload={setPhotoUpload} />
      <label htmlFor={"username"}>Имя:</label>
      <input
        required
        type={"text"}
        id={"username"}
        name={"username"}
        placeholder={"Имя пользователя"}
        value={values.value.username}
        onChange={values.onChange}
      />
      {typeof validationMessage !== "string" &&
        validationMessage.username &&
        validationMessage.username !== "isValid" && (
          <div className={"error"}>{validationMessage.username}</div>
        )}
      <label htmlFor={"birthday"}>Дата рождения:</label>
      <div className={"flex-gap"} id={"calendar"}>
        <Calendar
          onChange={(value, event) => setBirthday(value)}
          value={birthday}
          locale={"ru"}
        />
      </div>
      <label htmlFor={"gender"}>Пол:</label>
      <div className={"radios"}>
        {genders.map(({ id, name }) => (
          <div className="form-check" key={id}>
            <input
              type="radio"
              name="radios"
              className="form-check-input"
              id={id}
              checked={id === values.value.gender}
              onChange={() => {
                hardSet({ gender: id });
              }}
            />
            <label className="form-check-label" htmlFor={id}>
              {name}
            </label>
          </div>
        ))}
      </div>
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
      <label htmlFor={"repeatPassword"}>Повтор пароля:</label>
      <input
        required
        type={"password"}
        id={"repeatPassword"}
        name={"repeatPassword"}
        placeholder={"Повтор пароля"}
        value={values.value.repeatPassword}
        onChange={values.onChange}
      />
      {typeof validationMessage !== "string" &&
        validationMessage.repeatPassword &&
        validationMessage.repeatPassword !== "isValid" && (
          <div className={"error"}>{validationMessage.repeatPassword}</div>
        )}
      {typeof validationMessage === "string" && (
        <div className={"error"}>{validationMessage}</div>
      )}
      <div className={"btn-wrapper"}>
        <button
          className={"btn"}
          type={"submit"}
          disabled={!values.value.gender || !birthday}
        >
          Отправить
        </button>
        <button
          className={"button-like-link mt-1"}
          onClick={(e) => {
            e.preventDefault();
            toggleFormType();
          }}
        >
          Авторизация
        </button>
      </div>
    </form>
  );
};
