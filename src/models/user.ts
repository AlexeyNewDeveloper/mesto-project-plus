import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import errorSeparator from '../constants/separators';
import IncorrectDataTransmitted from '../errors/incorrect-data-transmitted';

const separator = errorSeparator.ERRORS_MESSAGES_SEPARATOR;

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line max-len, no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>;

}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: `${separator}Email введен некорректно, либо такой пользователь уже есть.`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (pass: string) => /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(pass),
      message: `${separator}Пароль должен содержать больше 8 символов, большие и маленькие буквы
      , цифру, и один из спецсимволов: !#$%&?`,
    },
  },
  name: {
    type: String,
    required: false,
    validate: {
      validator: (name: string) => /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/.test(name),
      message: `${separator}Некорректное имя.`,
    },
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    validate: {
      validator: (about: string) => /[A-Za-z\u0410-\u044F\u0401\u0451]{2,200}/.test(about),
      message: `${separator}Проверьте поле с описанием.`,
    },
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (avatar: string) => /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/.test(
        avatar,
      ),
      message: `${separator}Неправильная ссылка на аватар.`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new IncorrectDataTransmitted('Неправильные почта или пароль', true));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new IncorrectDataTransmitted('Неправильные почта или пароль', true));
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
