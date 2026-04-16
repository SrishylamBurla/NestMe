"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRef } from "react";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const socketRef = useRef(null);

  const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

useEffect(() => {
  fetch("/api/admin/support")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) setTickets(data);
      else setTickets([]);
    });

  // 🔌 connect socket
  socketRef.current = io("http://localhost:3000");
  const socket = socketRef.current;

  // 🟢 listen new messages
  socket.on("newMessage", (msg) => {
  setTickets((prev) =>
    prev.map((t) => {
      if (t.user?._id === msg.userId) {
        return {
          ...t,
          messages: [...t.messages, msg],
        };
      }
      return t;
    })
  );

  setSelected((prev) => {
    if (prev && prev.user?._id === msg.userId) {
      return {
        ...prev,
        messages: [...prev.messages, msg],
      };
    }
    return prev;
  });
});

  return () => socket.disconnect();
}, []);

  const sendReply = async () => {
    if (!reply || !selected) return;

    await fetch(`/api/support/${selected._id}/reply`, {
      method: "POST",
      body: JSON.stringify({ message: reply }),
      headers: { "Content-Type": "application/json" },
    });

    setReply("");
  };

  return (
    <div className="flex h-screen">

      {/* LEFT PANEL */}
      <div className="w-1/3 shadow-sm overflow-y-auto bg-white">
        <h2 className="p-3 font-bold bg-gray-800 text-white">Users</h2>

        {tickets.map((t) => (
          <div
            key={t._id}
            onClick={() => setSelected(t)}
            className={`p-3 cursor-pointer shadow-sm ${
              selected?._id === t._id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-semibold">
              {t.user?.name || "User"}
            </p>

           <div className="text-sm text-gray-500 flex justify-between">
  <span className="truncate max-w-[70%]">
    {t.messages.at(-1)?.text}
  </span>
  <span className="text-xs">
    {/* {formatTime(t.messages.at(-1)?.createdAt)} */}
  </span>
</div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col h-[650px] shadow-sm">
      <h2 className="p-3 font-semibold bg-gray-700 text-white text-center">Support Chat</h2>
        
        {!selected ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-violet-200 to-pink-200 text-gray-500">
            Select a chat
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-br from-violet-200 to-pink-200 text-gray-500">
              
              {selected.messages.map((m, i) => (
  <div
    key={i}
    className={`max-w-[60%] px-3 py-2 rounded-lg text-sm ${
      m.sender === "admin"
        ? "bg-gray-300 text-black"
        : "bg-gray-800 text-white ml-auto"
    }`}
  >
    {/* Message */}
    <p>{m.text}</p>

    {/* Timestamp */}
    <p
      className={`text-[10px] mt-1 text-right ${
        m.sender === "admin"
          ? "text-gray-600"
          : "text-blue-100"
      }`}
    >
      {formatTime(m.createdAt)}
    </p>
  </div>
))}
            </div>

            {/* Input */}
            <div className="flex p-3 shadow-md">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 border px-3 py-2 rounded-lg"
                placeholder="Type reply..."
              />

              <button
                onClick={sendReply}
                className="ml-2 bg-indigo-600 text-white px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}