import { ERRORS_MESSAGES_SEPARATOR } from "../constants/separators";
import IncorrectDataTransmitted from "../errors/incorrect-data-transmitted";
import mongoose, { Date } from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.Array;
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
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
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link: string) => {
        return /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/.test(
          link
        );
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Некорректная ссылка на картинку.`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    validate: {
      validator: (owner: string) => {
        return mongoose.Types.ObjectId.isValid(owner);
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Ошибка.`,
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
    validate: {
      validator: (likes: Array<string>) => {
        return likes.every((value) => mongoose.Types.ObjectId.isValid(value));
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Ошибка.`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (date: Date) => {
        return date instanceof Date;
      },
      message: `${ERRORS_MESSAGES_SEPARATOR}Ошибка.`,
    },
  },
});

export default mongoose.model("card", cardSchema);
