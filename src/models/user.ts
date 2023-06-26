import { ERRORS_MESSAGES_SEPARATOR } from "../constants/separators";
import IncorrectDataTransmitted from "../errors/incorrect-data-transmitted";
import mongoose from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (name: string) => {
        return /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/.test(name);
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Некорректное имя.`,
    },
  },
  about: {
    type: String,
    required: true,
    validate: {
      validator: (about: string) => {
        return /[A-Za-z\u0410-\u044F\u0401\u0451]{2,200}/.test(about);
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Проверьте поле с описанием.`,
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (avatar: string) => {
        return /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/.test(
          avatar
        );
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Неправильная ссылка на аватар.`,
    },
  },
});

export default mongoose.model<IUser>("user", userSchema);
