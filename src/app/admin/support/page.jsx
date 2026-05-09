"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { io } from "socket.io-client";

import {
  Send,
  ArrowLeft,
  Search,
  MessageCircle,
  User,
  Paperclip,
  MoreVertical,
} from "lucide-react";

export default function AdminSupport() {
  const [tickets, setTickets] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [reply, setReply] =
    useState("");

  const [showMobileChat, setShowMobileChat] =
    useState(false);

  const socketRef = useRef(null);

  const messagesEndRef =
    useRef(null);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selected]);

  // ================= FORMAT TIME =================
  const formatTime = (date) => {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= LOAD =================
  useEffect(() => {
    const loadTickets =
      async () => {
        try {
          const res =
            await fetch(
              "/api/admin/support"
            );

          const data =
            await res.json();

          if (
            Array.isArray(data)
          ) {
            setTickets(data);
          } else {
            setTickets([]);
          }
        } catch (err) {
          console.error(err);
          setTickets([]);
        }
      };

    loadTickets();

    // SOCKET
    socketRef.current = io(
      "http://localhost:3000"
    );

    const socket =
      socketRef.current;

    socket.on(
      "newMessage",
      (msg) => {
        if (!msg?.userId)
          return;

        // UPDATE TICKETS
        setTickets((prev) =>
          prev.map((t) => {
            if (
              t.user?._id ===
              msg.userId
            ) {
              return {
                ...t,
                messages: [
                  ...t.messages,
                  msg,
                ],
              };
            }

            return t;
          })
        );

        // UPDATE ACTIVE CHAT
        setSelected((prev) => {
          if (
            prev &&
            prev.user?._id ===
              msg.userId
          ) {
            return {
              ...prev,
              messages: [
                ...prev.messages,
                msg,
              ],
            };
          }

          return prev;
        });
      }
    );

    return () =>
      socket.disconnect();
  }, []);

  // ================= SEND =================
  const sendReply =
    async () => {
      if (!reply || !selected)
        return;

      await fetch(
        `/api/support/${selected._id}/reply`,
        {
          method: "POST",

          body: JSON.stringify({
            message: reply,
          }),

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      setReply("");
    };

  return (
    <div
      className="
        h-[calc(100vh-70px)]
        bg-[#efeae2]
        rounded-3xl
        overflow-hidden
        flex
        relative
      "
    >

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          ${
            showMobileChat
              ? "hidden"
              : "flex"
          }

          lg:flex
          flex-col

          w-full lg:w-[380px]

          bg-white
          border-r border-gray-200
        `}
      >

        {/* TOPBAR */}
        <div
          className="
            h-16 px-4
            bg-[#202c33]
            flex items-center
            justify-between
            text-white
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                w-10 h-10 rounded-full
                bg-yellow-100
                text-yellow-700
                flex items-center
                justify-center
                font-semibold
              "
            >
              A
            </div>

            <h2 className="font-semibold">
              Support Chats
            </h2>
          </div>

          <div className="flex gap-4">
            <Search size={20} />
            <MoreVertical
              size={20}
            />
          </div>
        </div>

        {/* CHAT LIST */}
        <div
          className="
            flex-1 overflow-y-auto
            bg-white
          "
        >
          {tickets.map((t) => {
            const lastMsg =
              t.messages.at(-1);

            return (
              <button
                key={t._id}
                onClick={() => {
                  setSelected(t);
                  setShowMobileChat(
                    true
                  );
                }}
                className={`
                  w-full text-left
                  px-4 py-3
                  flex gap-3
                  border-b border-gray-100
                  hover:bg-gray-50
                  transition
                  ${
                    selected?._id ===
                    t._id
                      ? "bg-[#f0f2f5]"
                      : ""
                  }
                `}
              >

                {/* AVATAR */}
                <div
                  className="
                    w-12 h-12 rounded-full
                    bg-yellow-100
                    text-yellow-700
                    shrink-0
                    flex items-center
                    justify-center
                    font-bold text-lg
                  "
                >
                  {t.user?.name?.charAt(
                    0
                  ) || (
                    <User
                      size={18}
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">

                  <div className="flex justify-between gap-2">

                    <h3
                      className="
                        font-semibold
                        text-gray-900
                        truncate
                      "
                    >
                      {t.user
                        ?.name ||
                        "User"}
                    </h3>

                    <span
                      className="
                        text-xs text-gray-400
                        whitespace-nowrap
                      "
                    >
                      {formatTime(
                        lastMsg?.createdAt
                      )}
                    </span>
                  </div>

                  <p
                    className="
                      text-sm text-gray-500
                      truncate mt-1
                    "
                  >
                    {
                      lastMsg?.text
                    }
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div
        className={`
          ${
            showMobileChat
              ? "flex"
              : "hidden"
          }

          lg:flex
          flex-col flex-1
          bg-[#efeae2]
        `}
      >

        {!selected ? (
          <div
            className="
              flex-1 flex flex-col
              items-center justify-center
              text-gray-500
              px-6
            "
          >
            <MessageCircle
              size={60}
              className="text-gray-300"
            />

            <h2 className="text-2xl font-semibold mt-4">
              Admin Support
            </h2>

            <p className="text-center mt-2">
              Select a chat to start
              messaging
            </p>
          </div>
        ) : (
          <>

            {/* HEADER */}
            <div
              className="
                h-16 px-4
                bg-[#202c33]
                text-white
                flex items-center
                justify-between
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                {/* MOBILE BACK */}
                <button
                  onClick={() =>
                    setShowMobileChat(
                      false
                    )
                  }
                  className="lg:hidden"
                >
                  <ArrowLeft
                    size={22}
                  />
                </button>

                {/* AVATAR */}
                <div
                  className="
                    w-10 h-10 rounded-full
                    bg-yellow-100
                    text-yellow-700
                    flex items-center
                    justify-center
                    font-semibold
                  "
                >
                  {selected.user?.name?.charAt(
                    0
                  )}
                </div>

                <div>
                  <h2 className="font-semibold">
                    {
                      selected.user
                        ?.name
                    }
                  </h2>

                  <p className="text-xs text-gray-300">
                    Online
                  </p>
                </div>
              </div>

              <MoreVertical
                size={20}
              />
            </div>

            {/* MESSAGES */}
            <div
              className="
                flex-1 overflow-y-auto
                px-3 py-4
                space-y-3
                bg-[#efeae2]
              "
            >
              {selected.messages.map(
                (m, i) => (
                  <div
                    key={i}
                    className={`
                      flex
                      ${
                        m.sender ===
                        "admin"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    {/* BUBBLE */}
                    <div
                      className={`
                        max-w-[85%]
                        sm:max-w-[70%]
                        px-4 py-2.5
                        rounded-2xl
                        shadow-sm
                        relative
                        ${
                          m.sender ===
                          "admin"
                            ? "bg-[#d9fdd3] rounded-br-sm"
                            : "bg-white rounded-bl-sm"
                        }
                      `}
                    >

                      {/* FILE */}
                      {m.file && (
                        <a
                          href={
                            m.file
                          }
                          target="_blank"
                          className="
                            flex items-center gap-2
                            text-sm underline
                            mb-2
                          "
                        >
                          <Paperclip
                            size={15}
                          />
                          Attachment
                        </a>
                      )}

                      {/* MESSAGE */}
                      <p
                        className="
                          text-sm
                          text-gray-900
                          break-words
                          pr-12
                        "
                      >
                        {m.text}
                      </p>

                      {/* TIME */}
                      <span
                        className="
                          absolute
                          bottom-2 right-3
                          text-[10px]
                          text-gray-500
                        "
                      >
                        {formatTime(
                          m.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}

              <div
                ref={messagesEndRef}
              />
            </div>

            {/* INPUT */}
            <div
              className="
                bg-[#f0f2f5]
                px-3 py-2
                flex items-center gap-2
              "
            >

              {/* INPUT */}
              <div
                className="
                  flex-1 bg-white
                  rounded-full
                  flex items-center
                  px-4
                "
              >
                <input
                  value={reply}
                  onChange={(e) =>
                    setReply(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      sendReply();
                    }
                  }}
                  placeholder="Type a message"
                  className="
                    flex-1
                    h-12
                    outline-none
                    bg-transparent
                    text-sm
                  "
                />
              </div>

              {/* SEND */}
              <button
                onClick={sendReply}
                className="
                  h-12 w-12
                  rounded-full
                  bg-[#00a884]
                  text-white
                  flex items-center
                  justify-center
                  shrink-0
                "
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}