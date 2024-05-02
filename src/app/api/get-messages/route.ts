import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        //match the current user
        $match: {
          _id: userId,
        },
      },
      {
        //unwind the messages array
        $unwind: "$messages",
      },
      {
        //sort the messages by createdAt
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        //group the messages by user
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Messages not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to find user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting messages",
      },
      { status: 500 }
    );
  }
}
