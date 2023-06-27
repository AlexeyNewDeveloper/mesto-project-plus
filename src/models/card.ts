import mongoose, { Date } from 'mongoose';
import errorSeparator from '../constants/separators';

const separator = errorSeparator.ERRORS_MESSAGES_SEPARATOR;

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
      validator: (name: string) => /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/.test(name),
      message: `${separator}Некорректное имя.`,
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link: string) => /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/.test(
        link,
      ),
      message: `${separator}Некорректная ссылка на картинку.`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    validate: {
      validator: (owner: string) => mongoose.Types.ObjectId.isValid(owner),
      message: `${separator}Ошибка.`,
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
    validate: {
      validator: (likes: Array<string>) => likes.every((v) => mongoose.Types.ObjectId.isValid(v)),
      message: `${separator}Ошибка.`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (date: Date) => date instanceof Date,
      message: `${separator}Ошибка.`,
    },
  },
});

export default mongoose.model('card', cardSchema);
