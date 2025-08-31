"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Fetch user chats
  const fetchUsersChats = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      if (!token) {
        toast.error("Unable to fetch auth token. Please try again.");
        return;
      }

      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const sortedChats = [...data.data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChats(sortedChats);
        if (sortedChats.length > 0) setSelectedChat(sortedChats[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    try {
      if (!user) return;

      const token = await getToken(); // ✅ fetch token
      console.log("Clerk token:", token); // log after declaration

      if (!token) {
        toast.error("Unable to fetch auth token. Please try again.");
        return;
      }

      const { data } = await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token to backend
          },
        }
      );

      if (data.success) {
        await fetchUsersChats(); // refresh chats after creating new chat
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) fetchUsersChats();
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
