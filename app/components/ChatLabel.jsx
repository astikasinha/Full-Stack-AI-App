'use client';
import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
  const { fetchUsersChats, chats, setSelectedChat } = useAppContext();

  const selectChat = () => {
    const chatData = chats.find((chat) => chat._id === id);
    setSelectedChat(chatData);
    console.log(chatData);
  };

  const renameHandler = async () => {
    try {
      const newName = prompt('Enter new name');
      if (!newName) return;

      const { data } = await axios.post('/api/chat/rename', {
        chatId: id,
        name: newName,
      });

      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete the chat?');
      if (!confirmDelete) return;

      const { data } = await axios.post('/api/chat/delete', {
        chatId: id,
      });

      if (data.success) {
        fetchUsersChats();
        setOpenMenu({ id: 0, open: false });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={selectChat}
      className="flex items-center justify-between p-2 text-white hover:bg-gray-600 rounded-lg text-sm group cursor-pointer bg-gray-700"
    >
      <p className="truncate max-w-[70%]">{name}</p>

      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu({ id: id, open: !openMenu.open });
        }}
        className="group relative flex items-center justify-center h-6 w-6 hover:bg-black/80 rounded-lg"
      >
        <Image
          src={assets.three_dots}
          alt="menu"
          className={`w-4 ${openMenu.id === id && openMenu.open ? '' : 'hidden'} group-hover:block`}
        />

        {/* Dropdown Menu */}
        <div
          className={`absolute ${
            openMenu.id === id && openMenu.open ? 'block' : 'hidden'
          } -right-36 top-6 bg-gray-800 rounded-xl w-max p-2 z-10`}
        >
          <div
            onClick={renameHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg text-white"
          >
            <Image src={assets.pencil_icon} alt="rename" className="w-4" />
            <p>Rename</p>
          </div>
          <div
            onClick={deleteHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg text-white"
          >
            <Image src={assets.delete_icon} alt="delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
