import { MutableRefObject, useRef } from "react";

type AvatarInputProps = {
  photoUpload: File | null;
  setPhotoUpload: (file: File) => void;
  column?: boolean;
};
export const AvatarInput = ({
  photoUpload,
  setPhotoUpload,
  column,
}: AvatarInputProps) => {
  const refInput = useRef() as MutableRefObject<HTMLInputElement>;
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!e.target.files[0].type.startsWith("image")) return;
    setPhotoUpload(e.target.files[0]);
  };
  return (
    <>
      <label htmlFor={"avatar"} className={"file-upload-label"}>
        Аватар:
      </label>
      <div className={`file-wrapper ${column ? "column" : ""}`}>
        <button
          className={"btn"}
          id={"avatar-btn"}
          onClick={(e) => {
            e.preventDefault();
            refInput.current.click();
          }}
        >
          Выбрать файл
        </button>
        {photoUpload && (
          <div>
            <div>Файл выбран:</div>
            <div className={"file-name"}>{photoUpload.name}</div>
          </div>
        )}
      </div>

      <label className={"screen-reader"}>
        <input
          ref={refInput}
          type={"file"}
          name={"avatar"}
          id={"avatar"}
          accept={"image/*"}
          multiple={false}
          onChange={onFile}
        />
      </label>
    </>
  );
};
