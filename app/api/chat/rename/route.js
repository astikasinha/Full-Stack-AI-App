import Chat from "../../../models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../config/db";


export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { chatId, name } = await req.json();
    await connectDB();

    const updated = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { name },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Chat not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Chat renamed successfully", chat: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
