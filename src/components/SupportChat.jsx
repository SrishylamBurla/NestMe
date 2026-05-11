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
  // const [typing, setTyping] = useState(false);

  const bottomRef = useRef();
  const socketRef = useRef(null);

  // 🧠 AI welcome messages
  // const defaultMessages = [
  //   { sender: "admin", text: "👋 Welcome to NestMe!" },
  //   {
  //     sender: "admin",
  //     text: "I’m your virtual assistant. I can help you buy, rent, or list properties.",
  //   },
  //   {
  //     sender: "admin",
  //     text: "What would you like to do?\n\n🏡 Buy Property\n🏢 Rent Property\n📢 Post Property\n❓ Help",
  //   },
  // ];

  // 🔄 Fetch initial messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/support");
      const tickets = res.data;

      if (tickets.length > 0) {
        setMessages(tickets[0].messages || []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ⚡ SOCKET SETUP
  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000");
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

    // socket.on("typing", () => {
    //   setTyping(true);
    //   setTimeout(() => setTyping(false), 1000);
    // });

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
      // socketRef.current?.emit("typing", user._id);

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
            <p className="text-sm font-semibold">
              NestMe Support
            </p>

            <p className="text-xs text-emerald-300">
              Usually replies within 30 mins
            </p>
          </div>
        </div>

        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center mt-3">
            <div className="max-w-sm text-center">

              {/* <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg mx-auto mb-5">
                <span className="text-4xl">💬</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                NestMe Customer Support
              </h2>

              <p className="text-emerald-600 text-sm font-semibold mb-6">
                Usually replies within 30 mins
              </p> */}

              <div className="p-3 bg-white rounded-2xl shadow-sm text-left">

                <p className="text-xs text-slate-700">
                  Welcome to NestMe Support
                  <br /><br />
                  Our support team can help you with:
                </p>

                <div className="grid grid-cols-1 gap-1 mt-5">

                  <div className="bg-slate-50 border text-sm border-slate-200 rounded-2xl p-2">
                    🏡 Property Listings
                  </div>

                  <div className="bg-slate-50 border text-sm border-slate-200 rounded-2xl p-2">
                    🔑 Account & Login Issues
                  </div>

                  <div className="bg-slate-50 border text-sm  border-slate-200 rounded-2xl p-2">
                    📞 Leads & Enquiries
                  </div>

                  <div className="bg-slate-50 border text-sm border-slate-200 rounded-2xl p-2">
                    💎 Subscription Support
                  </div>

                </div>

                <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
                  Please describe your issue clearly and our support team will get back to you shortly.
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`flex ${msg.sender === "user"
                ? "justify-end"
                : "justify-start"
              }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm shadow-sm ${msg.sender === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                }`}
            >
              <p className="leading-relaxed">
                {msg.text}
              </p>

              {msg.file && (
                <a
                  href={msg.file}
                  target="_blank"
                  className="block mt-3 text-xs underline"
                >
                  📎 View Attachment
                </a>
              )}
            </div>
          </div>
        ))}

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
