'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import ChatLabel from './ChatLabel';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '../context/AppContext';

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user, chats, createNewChat } = useAppContext();
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (qrRef.current && !qrRef.current.contains(event.target)) {
        setShowQR(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`flex flex-col justify-between h-screen bg-[#212327] pt-7 px-4 transition-all z-50 max-md:absolute max-md:h-screen
      ${expand ? 'w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}
    >
      {/* --- TOP SECTION --- */}
      <div>
        {/* Logo & Toggle */}
        <div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
          <Image
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="logo"
            width={expand ? 144 : 40}
            height={40}
          />

          {/* Toggle Button */}
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 rounded-lg cursor-pointer"
          >
            <Image src={assets.menu_icon} alt="menu" className="md:hidden" width={24} height={24} />
            <Image
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
              alt="toggle"
              className="hidden md:block w-7"
              width={28}
              height={28}
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-3 py-1 rounded shadow-md z-50">
              {expand ? 'Close sidebar' : 'Open sidebar'}
              <div className="absolute w-2 h-2 bg-black rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* New Chat */}
        <button
          onClick={createNewChat}
          className={`mt-10 flex items-center justify-start ${
            expand
              ? 'bg-[#4c82f7] hover:opacity-90 rounded-xl gap-3 p-3 pl-4 w-full'
              : 'group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg'
          }`}
        >
          <Image
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="chat"
            width={24}
            height={24}
          />
          {expand && <p className="text-white text-sm font-medium">New Chat</p>}
          {!expand && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-3 py-1 rounded shadow-md z-50">
              New Chat
              <div className="absolute w-2 h-2 bg-black rotate-45 bottom-[-4px] left-1/2 -translate-x-1/2" />
            </div>
          )}
        </button>

        {/* Recents */}
        <div className={`mt-8 text-white/25 text-sm ${expand ? 'block' : 'hidden'}`}>
          <p className="my-1">Recents</p>
          {chats.map((chat) => (
            <ChatLabel
              key={chat._id}
              name={chat.name}
              id={chat._id}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="pb-6">
        <div className="relative" ref={qrRef}>
          {/* Get App */}
          <div
            onClick={() => setShowQR((prev) => !prev)}
            className={`flex items-center cursor-pointer ${
              expand
                ? 'gap-2 text-white/80 text-sm p-2.5 border border-[#4c82f7] rounded-lg hover:bg-white/10'
                : 'h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg'
            }`}
          >
            <Image
              className={expand ? 'w-5' : 'w-6 mx-auto'}
              src={expand ? assets.phone_icon : assets.phone_icon_dull}
              alt="get-app"
            />
            {expand && (
              <>
                <span className="text-white">Get App</span>
                <Image src={assets.new_icon} alt="new" width={14} height={14} />
              </>
            )}
          </div>

          {/* My Profile */}
          <div
            onClick={user ? null : openSignIn}
            className={`flex items-center ${
              expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'
            } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
          >
            {user ? (
              <UserButton />
            ) : (
              <Image src={assets.profile_icon} alt="profile" className="w-7" />
            )}
            {expand && <span>My Profile</span>}
          </div>

          {/* QR Code Popup */}
          {showQR && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50">
              <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
                <Image src={assets.qrcode} alt="QR code" className="w-44" />
                <p className="mt-2 text-center">Scan to get AI app</p>
                <div className="w-3 h-3 absolute bg-black rotate-45 left-1/2 -translate-x-1/2 top-full mt-[-6px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
