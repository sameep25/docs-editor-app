import mongoose from "mongoose";

const Connection = async () => {
  const URL = `mongodb+srv://sameep:ZeVsZD1Gt5gTThC9@docseditor.i0wmccn.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error while connecting to database", error);
  }
};

export default Connection ;