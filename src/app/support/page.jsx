"use client";

import { useState, useEffect } from "react";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch tickets
  const fetchTickets = async () => {
    const res = await fetch("/api/support");
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    (async () => {
    await fetchTickets();
  })();
  }, []);

  // 📤 Create ticket
  const createTicket = async () => {
    if (!message) return alert("Message required");

    setLoading(true);

    let fileUrl = "";

    // 🔥 Step 1: upload file (if exists)
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

    // 🔥 Step 2: create ticket
    await fetch("/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, message, file: fileUrl }),
    });

    // ✅ reset state
    setSubject("");
    setMessage("");
    setFile(null);

    await fetchTickets(); // no reload
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">Help Center</h1>

      {/* 📝 Create Ticket */}
      <div className="bg-white p-4 rounded-xl mb-6 shadow">
        <input
          placeholder="Subject"
          value={subject}
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Describe your issue"
          value={message}
          className="w-full p-2 border rounded"
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          className="mt-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={createTicket}
          disabled={loading}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* 📩 Ticket List */}
      {tickets.map((t) => (
        <div key={t._id} className="bg-gray-100 p-3 rounded mb-4">
          <h2 className="font-semibold mb-2">{t.subject}</h2>

          <div className="space-y-1">
            {t.messages.map((m, i) => (
              <div key={i} className="text-sm">
                <b>{m.sender}:</b> {m.text}

                {m.file && (
                  <a
                    href={m.file}
                    target="_blank"
                    className="block text-blue-600 underline text-xs"
                  >
                    📎 View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}