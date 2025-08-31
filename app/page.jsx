'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets"; 
import Sidebar from "./components/Sidebar"; 
import PromptBox from "./components/PromptBox"; 
import { useAppContext } from "./context/AppContext"; // assuming this is where it's from
import Message from "./components/Message"; // assuming this component exists

export default function Home() {
  const [expand, setExpand] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [selectedChat?.messages]);


  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#FFFFFF] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => setExpand(!expand)}
              className="rotate-180 cursor-pointer"
              src={assets.menu_icon}
              alt="Menu"
              width={24}
              height={24}
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="Chat"
              width={24}
              height={24}
            />
          </div>

          {!selectedChat?.messages || selectedChat.messages.length === 0 ? (

            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="Logo" width={64} height={64} />
                <p className="text-2xl font-medium text-black">Hi, I am Astika's Chatbot App</p>
              </div>
              <p className="text-sm mt-2 text-black">How can I help you today?</p>
            </>
          ) : (
            <div
              ref={containerRef}
              className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
            >
              <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6 text-black">
                {selectedChat?.name}
              </p>

              {selectedChat?.messages?.map((msg, index) => (
  <Message key={index} role={msg.role} content={msg.content} />
))}


              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    src={assets.logo_icon}
                    alt="Logo"
                    width={36}
                    height={36}
                  />
                  <div className="loader flex justify-center items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce delay-200"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce delay-400"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <PromptBox setIsLoading={setIsLoading} isLoading={isLoading} />

          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
