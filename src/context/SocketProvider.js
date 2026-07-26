"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { useGetMeQuery } from "../store/services/authApi"
import { notificationApi } from "../store/services/notificationApi"

const SOCKET_URL = "https://www.nestme.in";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { data: user } = useGetMeQuery();

  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("🟢 Socket Connected");

      socketInstance.emit("join", user._id);
    });

    socketInstance.on("notification", (notification) => {
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          undefined,
          (draft) => {
            draft.unshift(notification);
          }
        )
      );

     toast.success("success",{
        text: notification.title,
        notification: notification.message
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [user?._id, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}