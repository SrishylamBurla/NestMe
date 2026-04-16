"use client";

import { useState } from "react";
import SupportChat from "./SupportChat";

export default function HelpWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-[50] bg-violet-600 text-white rounded-full w-14 h-14 box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px; flex items-center justify-center hover:scale-110 transition"
      >
        <img src="/icons/messages.png" alt="help" className="w-8 h-8" />
      </button>

      {open && <SupportChat onClose={() => setOpen(false)} />}
    </>
  );
}
