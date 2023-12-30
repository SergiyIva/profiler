import { useState } from "react";
import { Messages, validation } from "../../../../utils/validation";
import { useFormInput } from "../../../../hooks/useFormInput";
import { useChangePasswordMutation } from "../../../../services/api";
import { Loader } from "../../../../components/Loader/Loader";

type ChangePasswordProps = {};
export const ChangePassword = ({}: ChangePasswordProps) => {
  const [validationMessage, setMessage] = useState<Messages | string>("");
  const [values, reset, hardSet] = useFormInput({
    password: "",
    repeatPassword: "",
    oldPassword: "",
  });
  const [isSuccess, setSuccess] = useState(false);
  const [change, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");
    const validFn = validation();
    const msg = validFn(values.value);
    if (!msg.isValid) {
      setMessage(msg);
      return;
    }
    try {
      const res = await change({
        password: values.value.oldPassword,
        newPassword: values.value.password,
      }).unwrap();
      if (res.message) {
        setSuccess(true);
        reset();
      } else setMessage("Ошибка при попытке изменения пароля");
    } catch (err) {
      console.log(err);
      setMessage("Ошибка при попытке изменения пароля");
    }
  };

  if (isLoading) return <Loader />;
  return (
    <form onSubmit={onSubmit}>
      <h6>Безопасность</h6>
      <label htmlFor={"oldPassword"}>Пароль:</label>
      <input
        required
        type={"password"}
        id={"oldPassword"}
        name={"oldPassword"}
        placeholder={"Старый пароль"}
        value={values.value.oldPassword}
        onChange={values.onChange}
      />
      <label htmlFor={"password"}>Новый пароль:</label>
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
        <button className={"btn"} type={"submit"}>
          Отправить
        </button>
      </div>
      {isSuccess && <div className={"success"}>Пароль успешно изменен</div>}
    </form>
  );
};
