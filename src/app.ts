import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import userRouter from "./routes/user";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use("/users", usersRouter);
app.use("/users/:userId", userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
