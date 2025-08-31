import connectDB from "../../../config/db";
import Chat from "../../../models/Chat";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  await connectDB();

  const { userId } = getAuth(req);
  const { chatId, prompt } = await req.json();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    const assistantMessage = {
      role: "assistant",
      content: text,
      timestamp: Date.now(),
    };

    await Chat.findByIdAndUpdate(chatId, {
      $push: {
        messages: [
          {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
          },
          assistantMessage,
        ],
      },
      $set: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: assistantMessage });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ success: false, message: "Failed to generate response", error: error.message });
  }
}
