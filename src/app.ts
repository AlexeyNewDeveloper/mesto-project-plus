import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import userRouter from "./routes/user";
import cardsRouter from "./routes/cards";
import cardRouter from "./routes/card";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.body.owner = {
    _id: "649866319e2266ab4ef69072",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/users/:userId", userRouter);

app.use("/cards", cardsRouter);
app.use("/cards/:cardId", cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
