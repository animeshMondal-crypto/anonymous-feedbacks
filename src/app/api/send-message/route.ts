import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import { Message } from "@/models/user.model";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    //is user accepting messages
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message Sent Successfully",
        newMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
      },
      { status: 500 }
    );
  }
}
