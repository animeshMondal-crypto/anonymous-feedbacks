import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    const decodecUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodecUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeExpired) {
      user.isVerified = true;
      // user.verifyCode = null;
      // user.verifyCodeExpiry = null;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User verified",
        },
        { status: 200 }
      );
    } else if (!isCodeExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Code expired",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
