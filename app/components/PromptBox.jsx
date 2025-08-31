"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from "react-hot-toast";
import axios from 'axios';

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt;
    try {
      e.preventDefault();
      if (!user) return toast.error('Login to send message');
      if (isLoading) return toast.error('Wait for the previous prompt response');

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };

      // Update chat locally
      setChats(prevChats =>
        prevChats.map(chat =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...(chat.messages || []), userPrompt] }
            : chat
        )
      );

      setSelectedChat(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), userPrompt],
      }));

      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt,
      });

      if (data.success) {
        const message = data.data.content;
        const messageTokens = message.split(" ");

        let assistantMessage = {
  role: 'assistant',
  content: "",
  timestamp: Date.now(),
};

setSelectedChat(prev => ({
  ...prev,
  messages: [...(prev?.messages || []), assistantMessage],
}));

for (let i = 0; i < messageTokens.length; i++) {
  setTimeout(() => {
    const updatedContent = messageTokens.slice(0, i + 1).join(" ");
    setSelectedChat(prev => {
      const updatedMessages = [...(prev?.messages || [])];
      const lastMessageIndex = updatedMessages.length - 1;

      // Make a new object, don't mutate old one
      updatedMessages[lastMessageIndex] = {
        ...updatedMessages[lastMessageIndex],
        content: updatedContent,
      };

      return { ...prev, messages: updatedMessages };
    });
  }, i * 100); // reduced delay for snappier feel
}


        setChats(prevChats =>
          prevChats.map(chat =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...(chat.messages || []), data.data] }
              : chat
          )
        );
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center mt-6">
      <form
        onSubmit={sendPrompt}
        className="relative w-full max-w-2xl bg-[#404045] p-4 rounded-3xl transition-all"
      >
        <textarea
          onKeyDown={handleKeyDown}
          className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white pr-24"
          rows={2}
          placeholder="Message AI App"
          required
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />

        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <Image
            src={assets.pin_icon}
            alt="Pin"
            width={16}
            height={16}
            className="cursor-pointer"
          />
          <button
            type="submit"
            className={`${
              prompt ? 'bg-primary' : 'bg-[#71717a]'
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="Send"
              width={14}
              height={14}
            />
          </button>
        </div>

        <div className="absolute left-4 bottom-4 flex items-center gap-2 text-sm">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="DeepThink" width={20} height={20} />
            DeepThink(R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="Search" width={20} height={20} />
            Search
          </p>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
