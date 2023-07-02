import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import errorSeparator from '../constants/separators';
import AuthorizationError from '../errors/authorization-error';

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
      message: `${separator}Email введен некорректно.`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    trim: true,
    match: /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    trim: true,
    match: /[A-Za-z\u0410-\u044F\u0401\u0451]{2,200}/,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    trim: true,
    match: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError());
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError());
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
