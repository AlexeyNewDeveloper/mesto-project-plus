import IncorrectDataTransmitted from "../errors/incorrect-data-transmitted";
import mongoose, { Date } from "mongoose";

interface ICard {
  name: string;
  about: string;
  avatar: string;
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (name: string) => {
        return /[A-Za-z\u0410-\u044F\u0401\u0451]{2,30}/.test(name);
      },
      message: () => {
        throw new IncorrectDataTransmitted();
      },
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
      message: () => {
        throw new IncorrectDataTransmitted();
      },
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
      message: () => {
        throw new IncorrectDataTransmitted();
      },
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
      message: () => {
        throw new IncorrectDataTransmitted();
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (date: Date) => {
        return date instanceof Date;
      },
      message: () => {
        throw new IncorrectDataTransmitted();
      },
    },
  },
});

export default mongoose.model("card", cardSchema);
