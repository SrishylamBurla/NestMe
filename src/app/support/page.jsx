"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

import Image from "next/image";

import { useGetMeQuery } from "@/store/services/authApi";

export default function SupportPage() {

  // =========================
  // STATES
  // =========================

  const [tickets, setTickets] =
    useState([]);

  const [
    selectedTicket,
    setSelectedTicket,
  ] = useState(null);

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const { data } =
    useGetMeQuery();

  const user = data?.user;

  const messagesEndRef =
    useRef(null);

  // =========================
  // FETCH TICKETS
  // =========================

  const fetchTickets =
    async () => {

      try {

        const res =
          await fetch(
            "/api/support"
          );

        const data =
          await res.json();

        const sorted =
          [...data].sort(
            (a, b) =>
              new Date(
                b.updatedAt
              ) -
              new Date(
                a.updatedAt
              )
          );

        setTickets(sorted);

        if (
          sorted.length > 0
        ) {
          setSelectedTicket(
            sorted[0]
          );
        }

      } catch (err) {

        console.log(err);
      }
    };

  useEffect(() => {
    fetchTickets();
  }, []);

  // =========================
  // SOCKET
  // =========================

  useEffect(() => {

    if (!user?._id)
      return;

    const socket = io(
      "https://www.nestme.in",
      {
        transports: [
          "websocket",
        ],
        withCredentials: true,
      }
    );

    socket.on(
      "connect",
      () => {

        socket.emit(
          "join",
          user._id
        );
      }
    );

    socket.on(
      "support-message",
      (
        updatedTicket
      ) => {

        setTickets(
          (prev) => {

            const filtered =
              prev.filter(
                (t) =>
                  t._id !==
                  updatedTicket._id
              );

            return [
              updatedTicket,
              ...filtered,
            ];
          }
        );

        setSelectedTicket(
          updatedTicket
        );
      }
    );

    return () => {
      socket.disconnect();
    };

  }, [user?._id]);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );

  }, [
    selectedTicket,
  ]);

  // =========================
  // SEND MESSAGE
  // =========================

  const createTicket =
    async () => {

      if (
        !message.trim()
      )
        return;

      setLoading(true);

      try {

        let fileUrl =
          "";

        // ================= FILE UPLOAD =================

        if (file) {

          const formData =
            new FormData();

          formData.append(
            "file",
            file
          );

          const uploadRes =
            await fetch(
              "/api/upload",
              {
                method:
                  "POST",
                body: formData,
              }
            );

          const uploadData =
            await uploadRes.json();

          fileUrl =
            uploadData.url;
        }

        // ================= CREATE TICKET =================

        const res =
          await fetch(
            "/api/support",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  ticketId:
                    selectedTicket?._id,

                  subject:
                    subject ||
                    "Support Chat",

                  text: message,

                  file:
                    fileUrl,
                }
              ),
            }
          );

        const updatedTicket =
          await res.json();

        setTickets(
          (prev) => {

            const filtered =
              prev.filter(
                (t) =>
                  t._id !==
                  updatedTicket._id
              );

            return [
              updatedTicket,
              ...filtered,
            ];
          }
        );

        setSelectedTicket(
          updatedTicket
        );

        // ================= RESET =================

        setSubject("");

        setMessage("");

        setFile(null);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  const activeTicket =
    selectedTicket;

  return (

    <div
      className="
      min-h-screen
      
      bg-gradient-to-br
      from-slate-50
      via-white
      to-slate-100
      "
    >

      {/* ================= HEADER ================= */}

      <div
        className="
        sticky
        top-0
        z-40
        mobile-safe-top
        backdrop-blur-2xl
        bg-white/80
        border-b
        border-slate-200/70
        "
      >

        <div
          className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          h-[74px]
          flex
          items-center
          justify-between
          "
        >

          {/* LEFT */}
          <div
            className="
            flex
            items-center
            gap-3
            min-w-0
            "
          >

            <div
              className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-br
              from-indigo-600
              via-violet-600
              to-fuchsia-600
              flex
              items-center
              justify-center
              shadow-xl
              flex-shrink-0
              "
            >
              <span className="text-2xl">
                💬
              </span>
            </div>

            <div className="min-w-0">

              <h1
                className="
                text-lg
                sm:text-xl
                font-black
                text-slate-900
                truncate
                "
              >
                NestMe Help Center
              </h1>

              <p
                className="
                hidden
                sm:block
                text-sm
                text-slate-500
                truncate
                "
              >
                Professional property assistance
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div
            className="
            hidden
            lg:flex
            items-center
            gap-2
            bg-emerald-50
            border
            border-emerald-100
            px-4
            py-2
            rounded-full
            "
          >

            <span
              className="
              w-2
              h-2
              rounded-full
              bg-emerald-500
              animate-pulse
              "
            />

            <span
              className="
              text-sm
              font-semibold
              text-emerald-700
              "
            >
              Support Online
            </span>

          </div>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div
        className="
        max-w-7xl
        mx-auto
        px-3
        sm:px-5
        lg:px-8
        py-4
        sm:py-6
        "
      >

        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-[340px_1fr]
          gap-5
          lg:gap-6
          "
        >

          {/* ================= SIDEBAR ================= */}

          <div
            className="
            bg-white
            rounded-[32px]
            border
            border-slate-200
            shadow-sm
            overflow-hidden
            h-fit
            "
          >

            {/* HEADER */}
            <div
              className="
              px-5
              py-5
              border-b
              border-slate-100
              "
            >

              <h2
                className="
                text-lg
                font-bold
                text-slate-900
                "
              >
                Conversations
              </h2>

              <p
                className="
                text-sm
                text-slate-500
                mt-1
                "
              >
                Your support chats
              </p>

            </div>

            {/* TICKETS */}
            <div
              className="
              max-h-[650px]
              overflow-y-auto
              "
            >

              {tickets.length ===
                0 && (

                <div
                  className="
                  p-10
                  text-center
                  text-slate-500
                  text-sm
                  "
                >
                  No conversations yet
                </div>
              )}

              {tickets.map(
                (ticket, index) => (

                  <button
                    key={
                      ticket._id || index
                    }

                    onClick={() =>
                      setSelectedTicket(
                        ticket
                      )
                    }

                    className={`
                    w-full
                    text-left
                    px-5
                    py-4
                    border-b
                    border-slate-100
                    transition-all
                    duration-200

                    ${
                      activeTicket?._id ===
                      ticket._id
                        ? "bg-indigo-50"
                        : "hover:bg-slate-50"
                    }
                    `}
                  >

                    <div
                      className="
                      flex
                      items-start
                      justify-between
                      gap-3
                      "
                    >

                      <div className="min-w-0">

                        <h3
                          className="
                          font-semibold
                          text-slate-800
                          text-sm
                          truncate
                          "
                        >
                          {ticket.subject ||
                            "Support Chat"}
                        </h3>

                        <p
                          className="
                          text-xs
                          text-slate-500
                          mt-1
                          line-clamp-1
                          "
                        >
                          {
                            ticket
                              .messages?.[
                              ticket
                                .messages
                                .length -
                                1
                            ]?.text
                          }
                        </p>

                      </div>

                      <div
                        className="
                        w-2
                        h-2
                        rounded-full
                        bg-emerald-500
                        mt-2
                        flex-shrink-0
                        "
                      />

                    </div>

                  </button>
                )
              )}

            </div>

          </div>

          {/* ================= CHAT ================= */}

          <div
            className="
            bg-white
            rounded-[32px]
            border
            border-slate-200
            shadow-sm
            overflow-hidden
            flex
            flex-col
            min-h-[78vh]
            "
          >

            {/* ================= CHAT HEADER ================= */}

            <div
              className="
              px-5
              sm:px-6
              py-4
              border-b
              border-slate-100
              flex
              items-center
              justify-between
              gap-4
              "
            >

              <div
                className="
                flex
                items-center
                gap-3
                min-w-0
                "
              >

                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  overflow-hidden
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  "
                >

                  <Image
                    src="/splashlogo.png"
                    alt="NestMe"
                    width={42}
                    height={42}
                    className="object-contain"
                  />

                </div>

                <div className="min-w-0">

                  <h2
                    className="
                    font-bold
                    text-slate-900
                    truncate
                    "
                  >
                    NestMe Customer Support
                  </h2>

                  <p
                    className="
                    text-sm
                    text-emerald-600
                    font-medium
                    "
                  >
                    Usually replies within 30 mins
                  </p>

                </div>

              </div>

            </div>

            {/* ================= MESSAGES ================= */}

            <div
              className="
              flex-1
              overflow-y-auto
              px-4
              sm:px-6
              py-5
              bg-gradient-to-b
              from-slate-50
              to-white
              space-y-5
              "
            >

              {!activeTicket && (

                <div
                  className="
                  flex
                  items-center
                  justify-center
                  h-full
                  "
                >

                  <div
                    className="
                    max-w-xl
                    w-full
                    bg-white
                    border
                    border-slate-200
                    rounded-[32px]
                    p-8
                    shadow-xl
                    text-center
                    "
                  >

                    <div
                      className="
                      w-20
                      h-20
                      rounded-3xl
                      bg-gradient-to-br
                      from-indigo-600
                      via-violet-600
                      to-fuchsia-600
                      flex
                      items-center
                      justify-center
                      mx-auto
                      shadow-lg
                      "
                    >
                      <span className="text-4xl">
                        💬
                      </span>
                    </div>

                    <h2
                      className="
                      text-3xl
                      font-black
                      text-slate-900
                      mt-6
                      "
                    >
                      Welcome to NestMe Support
                    </h2>

                    <p
                      className="
                      text-slate-500
                      mt-3
                      leading-relaxed
                      "
                    >
                      Start a conversation and our
                      support team will help you shortly.
                    </p>

                  </div>

                </div>
              )}

              {activeTicket?.messages?.map(
                (m, i) => (

                  <div
                    key={i}
                    className={`
                    flex

                    ${
                      m.sender ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                    `}
                  >

                    <div
                      className={`
                      max-w-[88%]
                      sm:max-w-[75%]
                      rounded-[24px]
                      px-4
                      py-3
                      shadow-sm

                      ${
                        m.sender ===
                        "user"
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                          : "bg-white border border-slate-200 text-slate-800"
                      }
                      `}
                    >

                      <div
                        className="
                        flex
                        items-center
                        gap-2
                        mb-1
                        "
                      >

                        <span
                          className="
                          text-[10px]
                          uppercase
                          tracking-wide
                          opacity-70
                          font-bold
                          "
                        >
                          {m.sender}
                        </span>

                      </div>

                      <p
                        className="
                        text-sm
                        leading-relaxed
                        whitespace-pre-wrap
                        break-words
                        "
                      >
                        {m.text}
                      </p>

                      {m.file && (

                        <a
                          href={m.file}
                          target="_blank"
                          className="
                          inline-flex
                          items-center
                          gap-2
                          mt-4
                          text-xs
                          underline
                          "
                        >
                          📎 View Attachment
                        </a>
                      )}

                    </div>

                  </div>
                )
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

            {/* ================= INPUT ================= */}

            <div
              className="
              border-t
              border-slate-100
              bg-white
              px-4
              sm:px-6
              py-4
              "
            >

              <div
                className="
                bg-slate-50
                border
                border-slate-200
                rounded-[28px]
                p-3
                shadow-inner
                "
              >

                <textarea
                  rows={2}

                  placeholder="Describe your issue..."

                  value={message}

                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }

                  className="
                  w-full
                  bg-transparent
                  outline-none
                  resize-none
                  text-sm
                  px-2
                  py-2
                  "
                />

                <div
                  className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                  mt-3
                  "
                >

                  {/* FILE */}
                  <input
                    type="file"

                    onChange={(e) =>
                      setFile(
                        e.target
                          .files[0]
                      )
                    }

                    className="
                    text-xs
                    text-slate-500
                    "
                  />

                  {/* BUTTON */}
                  <button
                    onClick={
                      createTicket
                    }

                    disabled={
                      loading
                    }

                    className="
                    w-full
                    sm:w-auto
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-semibold
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    transition-all
                    duration-300
                    shadow-lg
                    disabled:opacity-50
                    "
                  >

                    {loading
                      ? "Sending..."
                      : "Send Message"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}