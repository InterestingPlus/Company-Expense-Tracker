import mongoose from "mongoose";

const DBConnection = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Connected to Database - MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to Database:", err);
  });
};

export default DBConnection;
