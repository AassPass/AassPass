
import Script from 'next/script';

const userFaqs = [
  {
    q: "What is Lokaly Map?",
    a: "Lokaly Map is a real-time, hyperlocal discovery tool by AassPass. It helps you find nearby deals, offers, and verified local businesses — from cafés and salons to gyms and retail stores — all mapped for your convenience.",
  },
  {
    q: "How does Lokaly Map work?",
    a: "Just open Lokaly Map on the AassPass platform. You’ll see pins for nearby verified businesses offering real-time deals and services based on your location.",
  },
  {
    q: "Do I need to sign up to use Lokaly Map?",
    a: "No sign-up is needed to browse. But creating an account unlocks features like saved locations, personalized offers, and faster support.",
  },
  {
    q: "Are deals shown in real-time?",
    a: "Yes. Lokaly Map shows live hyperlocal deals and updates from businesses in your area, including flash discounts and limited-time services.",
  },
  {
    q: "How do I contact or book a service?",
    a: "Each business profile has quick actions like call, WhatsApp, or online booking if available.",
  },
];

const businessFaqs = [
  {
    q: "What is AassPass for Businesses?",
    a: "AassPass for Businesses is a smart platform for local business owners to register, verify, and promote their services on the Lokaly Map — reaching real users in real time.",
  },
  {
    q: "How do I register my business on AassPass?",
    a: "Go to the “Register Your Business” section on the AassPass platform. Fill in your details, and our team will verify and activate your listing.",
  },
  {
    q: "What do I get as a listed business?",
    a: "• A verified spot on Lokaly Map\n• Ability to post real-time offers\n• Increased visibility in your area\n• Direct customer contacts (calls/WhatsApp/bookings)",
  },
  {
    q: "Is there a cost to list my business?",
    a: "Listing is free in the early access phase. Premium features (like featured pins, analytics, or priority placement) will be introduced soon.",
  },
  {
    q: "How can I update my business details or offers?",
    a: "Once registered, you’ll get access to your business dashboard to update your profile, deals, working hours, and contact options anytime.",
  },
];

export default function Faq() {
  const allFaqs = [...userFaqs, ...businessFaqs];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a.replace(/\n/g, "<br/>"),
      },
    })),
  };

  return (
    <section id="faq" className="w-full px-4 py-10 flex justify-center bg-gray-200">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 px-2">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              For Users – Lokaly Map
            </h2>
            {userFaqs.map((item, i) => (
             <details
  key={i}
  className="mb-3 border rounded-lg bg-white shadow overflow-hidden transition duration-300"
>
  <summary className="cursor-pointer px-5 py-3 text-gray-800 font-medium hover:bg-gray-100 transition">
    {item.q}
  </summary>
  <div className="faq-content px-5 py-3 text-gray-700 whitespace-pre-line text-sm leading-relaxed">
    {item.a}
  </div>
</details>

            ))}
          </div>

          <div className="w-full md:w-1/2 px-2">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              For Business Owners – AassPass for Businesses
            </h2>
            {businessFaqs.map((item, i) => (
              <details
  key={i}
  className="mb-3 border rounded-lg bg-white shadow overflow-hidden transition duration-300"
>
  <summary className="cursor-pointer px-5 py-3 text-gray-800 font-medium hover:bg-gray-100 transition">
    {item.q}
  </summary>
  <div className="faq-content px-5 py-3 text-gray-700 whitespace-pre-line text-sm leading-relaxed">
    {item.a}
  </div>
</details>


            ))}
          </div>
        </div>
      </div>

      {/* Google Structured Data for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
