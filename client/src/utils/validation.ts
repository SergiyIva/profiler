export type InputObject = {
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
};

export type Messages = {
  isValid: boolean;
} & { [key in keyof InputObject]: string };

export type ConfigValidation = {
  optional: (keyof InputObject)[];
};

const defaultConfig: ConfigValidation = {
  optional: [],
};

export const validation =
  (config: ConfigValidation = defaultConfig) =>
  (object: InputObject): Messages => {
    let messages: Messages = { isValid: false };
    let isValidate;

    const username = object.username?.trim();
    const email = object.email?.trim().toLowerCase();
    const password = object.password;
    const repeatPassword = object.repeatPassword;

    if (object.hasOwnProperty("username")) {
      if (!username) {
        if (config.optional.indexOf("username") < 0) {
          messages.username = "Заполните поле Имя!";
          isValidate = false;
        }
      } else if (username.length > 200) {
        messages.username = "Имя должно быть короче 200 знаков!";
        isValidate = false;
      } else if (
        !/\w/.test(username) &&
        !/\p{Script=Cyrillic}+/u.test(username)
      ) {
        messages.username = "Имя должно содержать буквы!";
        isValidate = false;
      } else {
        messages.username = "isValid";
      }
    }

    if (object.hasOwnProperty("email")) {
      if (!email) {
        if (config.optional.indexOf("email") < 0) {
          messages.email = "Заполните поле Email!";
          isValidate = false;
        }
      } else if (!/@/.test(email)) {
        messages.email = "Email должен содержать знак @!";
        isValidate = false;
      } else if (!/^\S+@/.test(email)) {
        messages.email = "Email должен содержать знаки до @!";
        isValidate = false;
      } else if (!/@\S+/.test(email)) {
        messages.email = "Email должен содержать знаки после @!";
        isValidate = false;
      } else if (!/(\.+\w{2,10})$/.test(email)) {
        messages.email = "Email должен содержать домен!";
        isValidate = false;
      } else if (email.length > 300) {
        messages.email = "Email должен быть короче 300 знаков!";
        isValidate = false;
      } else {
        messages.email = "isValid";
      }
    }

    if (object.hasOwnProperty("password")) {
      if (!password) {
        if (config.optional.indexOf("password") < 0) {
          messages.password = "Заполните поле Пароль!";
          isValidate = false;
        }
      } else if (password.length < 4) {
        messages.password = "Пароль должен содержать минимум 4 знака!";
        isValidate = false;
      } else if (!/\w/.test(password)) {
        messages.password = "Пароль должен содержать латинские буквы/числа!";
        isValidate = false;
      } else if (password.length > 200) {
        messages.password = "Пароль должен быть короче 200 знаков!";
        isValidate = false;
      } else {
        messages.password = "isValid";
      }
    }

    if (object.hasOwnProperty("repeatPassword")) {
      if (repeatPassword === password) {
        messages.repeatPassword = "isValid";
      } else {
        messages.repeatPassword = "Пароли не совпадают!";
        isValidate = false;
      }
    }

    messages.isValid = isValidate === undefined;

    return messages;
  };
