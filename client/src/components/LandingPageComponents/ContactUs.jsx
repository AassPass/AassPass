"use client";

import { useState } from "react";
import { showToast } from "@/Utils/toastUtil";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const message = e.target.message.value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "warning");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email.", "error");
      return;
    }

    setLoading(true);

    try {
      // Simulate network request
      await new Promise((r) => setTimeout(r, 1500));

      showToast("Message sent successfully!", "success");
      e.target.reset();
    } catch (error) {
      showToast("Failed to send message. Please try again later.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 py-8 md:py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 sm:p-10"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">
          Contact Us
        </h2>

        <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          className="w-full px-4 py-3 mb-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 mb-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="6"
          placeholder="Write your message here..."
          className="w-full px-4 py-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
