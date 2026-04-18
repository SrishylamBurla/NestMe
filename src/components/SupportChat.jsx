"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";



export default function SupportChat({ onClose }) {
  const { user, isLoading } = useAuth()

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef();
  const socketRef = useRef(null);

  // 🧠 AI welcome messages
  const defaultMessages = [
    { sender: "admin", text: "👋 Welcome to NestMe!" },
    {
      sender: "admin",
      text: "I’m your virtual assistant. I can help you buy, rent, or list properties.",
    },
    {
      sender: "admin",
      text: "What would you like to do?\n\n🏡 Buy Property\n🏢 Rent Property\n📢 Post Property\n❓ Help",
    },
  ];

  // 🔄 Fetch initial messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/support");
      const tickets = res.data;

      if (tickets.length > 0 && tickets[0].messages.length > 0) {
        setMessages(tickets[0].messages);
      } else {
        setMessages(defaultMessages);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages(defaultMessages);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ⚡ SOCKET SETUP
  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000" );
    const socket = socketRef.current;

    socket.emit("join", user._id);

    socket.on("newMessage", (msg) => {
  // ✅ only accept messages for this user
  if (msg.userId !== user._id) return;

  setMessages((prev) => [...prev, msg]);
});

    // socket.on("newMessage", (msg) => {
    //   setMessages((prev) => {
    //     const exists = prev.some(
    //       (m) =>
    //         m.text === msg.text &&
    //         m.sender === msg.sender &&
    //         (m.file || "") === (msg.file || ""),
    //     );

    //     return exists ? prev : [...prev, msg];
    //   });
    // });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 Send message
  const sendMessage = async () => {
    if (!text && !file) return;

    setLoading(true);

    let fileUrl = "";

    try {
      // 📎 Upload file
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post("/api/upload", formData);
        fileUrl = uploadRes.data.url;
      }

      // 💬 Emit typing
      socketRef.current?.emit("typing", user._id);

      const newMsg = {
        sender: "user",
        text,
        file: fileUrl,
        userId: user._id
      };

      // 🔥 STEP 1: show instantly
      setMessages((prev) => [...prev, newMsg]);

      // 🔥 STEP 2: save to DB
      await axios.post("/api/support/message", {
        text,
        file: fileUrl,
      });


      setText("");
      setFile(null);
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full h-[100dvh] sm:bottom-20 sm:right-6 sm:w-80 sm:h-[500px] z-[999] bg-white rounded-none sm:rounded-2xl flex flex-col overflow-hidden shadow-lg">
      {/* Header */}
      <div className="text-white bg-gradient-to-r from-violet-800 to-pink-800 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-semibold">Support</p>
            <p className="text-xs text-gray-300">Online</p>
          </div>
        </div>

        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-t from-violet-100 via-pink-100 to-purple-200">
        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow ${
              msg.sender === "user"
                ? "bg-violet-800 text-white ml-auto rounded-br-none"
                : "bg-gray-800 text-white rounded-bl-none"
            }`}
          >
            {msg.text}

            {/* Quick actions */}
            {msg.text?.includes("🏡") && (
              <div className="flex flex-wrap gap-2 mt-2">
                {["Buy Property", "Rent Property", "Post Property", "Help"].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setText(opt);
                        setTimeout(() => {
                          sendMessage();
                        }, 100);
                      }}
                      className="bg-white text-black px-2 py-1 rounded-full text-xs"
                    >
                      {opt}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* File */}
            {msg.file && (
              <a
                href={msg.file}
                target="_blank"
                className="text-xs underline mt-1 flex items-center gap-1"
              >
                <img src="/icons/attach.png" alt="Attach" className="w-4 h-4" />{" "}
                Attachment
              </a>
            )}
          </div>
        ))}

        {/* Typing */}
        {typing && (
          <div className="text-xs text-gray-500 italic">
            NestMe is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-2 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center gap-2">
        <label className="cursor-pointer text-lg">
          <img src="/icons/attach.png" alt="Attach" className="w-5 h-5" />
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <input
          type="text"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gray-700 text-white px-4 py-2 rounded-full"
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}
