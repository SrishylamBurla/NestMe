// "use client";

// import { useState, useEffect } from "react";

// export default function SupportPage() {
//   const [tickets, setTickets] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔄 Fetch tickets
//   const fetchTickets = async () => {
//     const res = await fetch("/api/support");
//     const data = await res.json();
//     setTickets(data);
//   };

//   useEffect(() => {
//     (async () => {
//       await fetchTickets();
//     })();
//   }, []);

//   // 📤 Create ticket
//   const createTicket = async () => {
//     if (!message) return alert("Message required");

//     setLoading(true);

//     let fileUrl = "";

//     // 🔥 Step 1: upload file (if exists)
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);

//       const uploadRes = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const uploadData = await uploadRes.json();
//       fileUrl = uploadData.url;
//     }

//     // 🔥 Step 2: create ticket
//     await fetch("/api/support", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ subject, message, file: fileUrl }),
//     });


//     const newTicket = await res.json();

//     // 🔥 instantly update UI
//     setTickets((prev) => [newTicket, ...prev]);

//     // ✅ reset state
//     setSubject("");
//     setMessage("");
//     setFile(null);

//     // await fetchTickets(); 
//     setLoading(false);
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-xl font-bold mb-6">Help Center</h1>

//       {/* 📝 Create Ticket */}
//       <div className="bg-white p-4 rounded-xl mb-6 shadow">
//         <input
//           placeholder="Subject"
//           value={subject}
//           className="w-full mb-2 p-2 border rounded"
//           onChange={(e) => setSubject(e.target.value)}
//         />

//         <textarea
//           placeholder="Describe your issue"
//           value={message}
//           className="w-full p-2 border rounded"
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <input
//           type="file"
//           className="mt-2"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         <button
//           onClick={createTicket}
//           disabled={loading}
//           className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded w-full"
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </div>

//       {/* 📩 Ticket List */}
//       {tickets.map((t) => (
//         <div key={t._id} className="bg-gray-100 p-3 rounded mb-4">
//           <h2 className="font-semibold mb-2">{t.subject}</h2>

//           <div className="space-y-1">
//             {t.messages.map((m, i) => (
//               <div key={i} className="text-sm">
//                 <b>{m.sender}:</b> {m.text}

//                 {m.file && (
//                   <a
//                     href={m.file}
//                     target="_blank"
//                     className="block text-blue-600 underline text-xs"
//                   >
//                     📎 View Attachment
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import { useGetMeQuery } from "@/store/services/authApi";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data } = useGetMeQuery();
  const user = data?.user;

  const messagesEndRef = useRef(null);

  /* ================= FETCH TICKETS ================= */

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support");
      const data = await res.json();

      setTickets(
        [...data].sort(
          (a, b) =>
            new Date(b.updatedAt) -
            new Date(a.updatedAt)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user?._id) return;

    const socket = io("https://www.nestme.in", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED");

      socket.emit("join", user._id);
    });

    socket.on("support-message", (updatedTicket) => {
      console.log("🔥 RECEIVED", updatedTicket);

      setTickets((prev) => {
        const filtered = prev.filter(
          (t) => t._id !== updatedTicket._id
        );

        return [updatedTicket, ...filtered];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);
  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [tickets]);

  /* ================= CREATE MESSAGE ================= */

  const createTicket = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      let fileUrl = "";

      /* ================= FILE UPLOAD ================= */

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        fileUrl = uploadData.url;
      }

      /* ================= SEND MESSAGE ================= */

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          text: message,
          file: fileUrl,
        }),
      });

      const updatedTicket = await res.json();

      setTickets((prev) => {
        const filtered = prev.filter(
          (t) => t._id !== updatedTicket._id
        );

        return [updatedTicket, ...filtered];
      });

      // await res.json();
      // await fetchTickets();
      /* ================= RESET ================= */

      setSubject("");
      setMessage("");
      setFile(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const latestTicket = tickets[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-28">
      {/* ================= HEADER ================= */}

      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">💬</span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                NestMe Help Center
              </h1>

              <p className="text-sm text-slate-500">
                Professional property assistance & customer support
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Support Team • Usually replies within 30 mins
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}

      <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-[320px_1fr] gap-6">
        {/* ================= SIDEBAR ================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Support Tickets</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your recent conversations
            </p>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {tickets.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No conversations yet
              </div>
            )}

            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {ticket.subject || "Support Chat"}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {ticket.messages?.[ticket.messages.length - 1]?.text}
                    </p>
                  </div>

                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHAT ================= */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[700px]">
          {/* ================= CHAT HEADER ================= */}

          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                <Image
                  src="/splashlogo.png"
                  alt="NestMe"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  NestMe Customer Support
                </h2>

                <p className="text-sm text-emerald-600 font-medium">
                  Usually replies within 30 mins
                </p>
              </div>
            </div>
          </div>

          {/* ================= MESSAGES ================= */}

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-gradient-to-b from-slate-50 to-white">

            {!latestTicket && (
              <div className="flex justify-center items-center h-full py-10">
                <div className="max-w-xl w-full bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl">

                  <div className="flex flex-col items-center text-center">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg mb-5">
                      <span className="text-4xl">💬</span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      NestMe Customer Support
                    </h2>

                    <p className="text-emerald-600 font-semibold text-sm mb-6">
                      Usually replies within 30 minutes
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left w-full">

                      <p className="text-slate-700 leading-relaxed text-sm">
                        Welcome to NestMe Support 👋
                        <br />
                        <br />
                        Our team is here to help you with:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                          🏡 Property Listings
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                          🔑 Account & Login Issues
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                          📞 Leads & Enquiries
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                          💎 Subscription Support
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                          📱 App-related Assistance
                        </div>

                      </div>

                      <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
                        Please describe your issue clearly and our support team will get back to you shortly.
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
            {latestTicket?.messages?.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-sm
                  ${m.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold opacity-80 uppercase">
                      {m.sender}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed">{m.text}</p>

                  {m.file && (
                    <a
                      href={m.file}
                      target="_blank"
                      className="block mt-3 text-xs underline"
                    >
                      📎 View Attachment
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= INPUT ================= */}

          <div className="border-t border-slate-100 p-4 bg-white">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3 shadow-inner">
              <textarea
                rows={2}
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent outline-none resize-none px-2 text-sm"
              />

              <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="text-xs"
                  />
                </div>

                <button
                  onClick={createTicket}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}