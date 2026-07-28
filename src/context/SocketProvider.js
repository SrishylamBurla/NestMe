"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { useGetMeQuery } from "../store/services/authApi";
import { notificationApi } from "../store/services/notificationApi";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://www.nestme.in";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { data } = useGetMeQuery();

  const user = data?.user;
  const dispatch = useDispatch();

  const socketRef = useRef(null);

  useEffect(() => {
    // Disconnect if user logs out
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Prevent duplicate connections
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket Connected");

      socket.emit("join", user._id);
    });

    socket.on("notification", (notification) => {
      // Update RTK Query cache instantly
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          undefined,
          (draft) => {
            draft.unshift(notification);
          },
        ),
      );

      toast.success(notification.title, {
        duration: 4000,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, dispatch]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
