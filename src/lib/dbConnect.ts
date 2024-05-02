import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to db");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    // console.log(db);

    connection.isConnected = db.connections[0].readyState;
    // console.log(db.connections);

    console.log("db connected successfully");
  } catch (error) {
    console.log("db connection failed ", error);
    process.exit(1);
  }
}
