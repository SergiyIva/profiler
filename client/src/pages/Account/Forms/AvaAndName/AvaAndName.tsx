import { AvatarInput } from "../../../../components/AvatarInput/AvatarInput";
import { useState } from "react";
import { useFormInput } from "../../../../hooks/useFormInput";
import { validation } from "../../../../utils/validation";
import { compress } from "../../../../utils/compress";
import { useUpdateUserMutation } from "../../../../services/api";
import { Loader } from "../../../../components/Loader/Loader";
import { setAuth } from "../../../../features/auth/authSlice";
import { useAppDispatch } from "../../../../hooks/store";

type AvaAndNameProps = {
  username: string;
};
export const AvaAndName = ({ username }: AvaAndNameProps) => {
  const dispatch = useAppDispatch();
  const [photoUpload, setPhotoUpload] = useState<null | File>(null);
  const [validationMessage, setMessage] = useState<string>("");
  const [values, reset] = useFormInput({
    username,
  });
  const [change, { isLoading }] = useUpdateUserMutation();
  const [isSuccess, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setMessage("");
    const validFn = validation();
    const msg = validFn(values.value);
    if (!msg.isValid) {
      setMessage(msg.username!);
      return;
    }
    try {
      const formData = new FormData();
      let avatar;
      if (photoUpload) {
        avatar = await compress(photoUpload);
        if (avatar) formData.append("avatar", avatar);
      }
      formData.append("username", values.value.username);
      const user = await change(formData).unwrap();
      dispatch(setAuth({ user }));
      setSuccess(true);
      setPhotoUpload(null);
    } catch (err) {
      console.log(err);
      setMessage("Ошибка при попытке изменения");
    }
  };

  if (isLoading) return <Loader />;
  return (
    <form onSubmit={onSubmit}>
      <h6>Данные пользователя</h6>
      <AvatarInput
        photoUpload={photoUpload}
        setPhotoUpload={setPhotoUpload}
        column={true}
      />
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
      {!!validationMessage && validationMessage !== "isValid" && (
        <div className={"error"}>{validationMessage}</div>
      )}
      <div className={"btn-wrapper"}>
        <button className={"btn"} type={"submit"}>
          Отправить
        </button>
      </div>
      {isSuccess && <div className={"success"}>Профиль успешно изменен</div>}
    </form>
  );
};
