import mongoose from 'mongoose';
import errorSeparator from '../constants/separators';

const separator = errorSeparator.ERRORS_MESSAGES_SEPARATOR;

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
      validator: (name: string) => /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/.test(name),
      message: `${separator}Некорректное имя.`,
    },
  },
  about: {
    type: String,
    required: true,
    validate: {
      validator: (about: string) => /[A-Za-z\u0410-\u044F\u0401\u0451]{2,200}/.test(about),
      message: `${separator}Проверьте поле с описанием.`,
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (avatar: string) => /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/.test(
        avatar,
      ),
      message: `${separator}Неправильная ссылка на аватар.`,
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
