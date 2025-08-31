import connectDB from "../../../config/db";
import Chat from "../../../models/Chat";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Use the request to extract user info
    const { userId } = auth({ req });

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
    };

    await Chat.create(chatData);

    return NextResponse.json({ success: true, message: "Chat created" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
