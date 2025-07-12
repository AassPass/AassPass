"use client";
import {
  SendHorizontal,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const WhatsAppButton = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");

  if (!phoneNumber) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    const encodedMessage = encodeURIComponent(message.trim());
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
    setMessage("");
    setOpenChat(false); // Optional: close chat after sending
  };

  return (
    <>
      {/* Chat Box */}
      {openChat && (
        <div className="w-100 h-60 overflow-hidden flex-col flex absolute border border-indigo-500 right-2 bottom-2 rounded-4xl shadow-lg z-50">
          {/* Header */}
          <div className="bg-indigo-500 px-6 py-4 flex justify-between items-center text-white">
            <h2 className="text-sm">
              Powered by{" "}
              <span className="text-xs ml-1 font-light">WebJuncture</span>
            </h2>
            <X className="cursor-pointer" onClick={() => setOpenChat(false)} />
          </div>

          {/* Chat Area */}
          <div className="p-2 bg-indigo-50 flex flex-col flex-grow h-full">
            <h2 className="px-4 py-2 rounded-full bg-indigo-200 text-indigo-900 w-fit mb-4 text-sm font-medium">
              How can we help you?
            </h2>

            {/* Message Input */}
            <div className="bg-white p-2 rounded-3xl mt-auto flex items-center gap-2 shadow-inner">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow px-3 py-2 rounded-full outline-none text-gray-700 bg-gray-100 placeholder:text-gray-400 text-sm"
              />
              <SendHorizontal
                size={22}
                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                onClick={handleSend}
              />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
    {!openChat &&   <button
        onClick={() => setOpenChat((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition"
      >
        <FaWhatsapp className="text-2xl" />
      </button>}
    </>
  );
};

export default WhatsAppButton;
