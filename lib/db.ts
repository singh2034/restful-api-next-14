import mongoose from "mongoose";
// calling db form env
const MONGODB_URI = process.env.MONGODB_URI;

// calling DB to connect with server
const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  // checking for connection done or not
  if (connectionState === 1) {
    console.log("Connected successfully");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }
  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("connected");
  } catch (err: any) {
    console.log("Error: ", err);
    throw new Error("Error: ", err);
  }
};

export default connect;
