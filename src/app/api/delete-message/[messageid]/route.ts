import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: {
            _id: messageId,
          },
        },
      }
    );

    if (updatedResult.modifiedCount == 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete message", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      { status: 500 }
    );
  }
}
