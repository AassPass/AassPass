import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0b161c] text-white px-6 w-full pt-10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm pb-10 border-b border-white/10">
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-xl font-bold text-blue-400">AassPass</h2>
          <p className="mt-2 text-white/80">Apna Sheher. Apne Deals. Sab Kuch Yahin Milega!</p>
          <p className="mt-4 text-white/60 text-xs">© {new Date().getFullYear()} AassPass. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/#explore-offers" className="hover:underline">Explore Offers</Link></li>
            <li><Link href="/#register-business" className="hover:underline">Register Your Business</Link></li>
            <li><Link href="/lokalymap" className="hover:underline">Lokaly Map</Link></li>
            <li><Link href="/#faq" className="hover:underline">FAQs</Link></li>
          </ul>
        </div>

        {/* For Users */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Users</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/#faq" className="hover:underline">How Lokaly Map Works</Link></li>
            <li><Link href="/#faq" className="hover:underline">Nearby Deals</Link></li>
            <li><Link href="/#faq" className="hover:underline">Help & Support</Link></li>
          </ul>
        </div>

        {/* For Business Owners */}
        <div>
          <h4 className="text-white font-semibold mb-3">For Business Owners</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="#" className="hover:underline">AassPass for Business</Link></li>
            <li><Link href="#" className="hover:underline">Get Verified</Link></li>
            <li><Link href="#" className="hover:underline">Post Real-Time Offers</Link></li>
            <li><Link href="/Account/user-login" className="hover:underline">Dashboard Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Website Social & Contact */}
      <div className="mt-8 flex flex-col items-center space-y-4 text-white text-sm">
        <div className="flex gap-6 text-xl">
          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
            <FaInstagram />
          </a>
          <a href="mailto:lokaly.map@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className="hover:text-red-400 transition-colors">
            <FaEnvelope />
          </a>
          <a href="tel:+919599165532" target="_blank" rel="noopener noreferrer" aria-label="Phone" className="hover:text-green-400 transition-colors">
            <FaPhoneAlt />
          </a>
        </div>
        <p className="text-white/60 text-xs text-center">Email: lokaly.map@gmail.com | Phone: +91-12345-67890</p>
      </div>

      <div className="mt-6 text-center text-white/60 text-xs border-t border-white/10 pt-4">
        Made in your city – connect with your local world on{" "}
        <span className="text-blue-400 font-semibold">AassPass</span>.
      </div>
      {/* Bottom Tagline */}

      {/* Developer Credit - final line */}
      <div className="mt-3 text-center text-white/40 text-[11px] pb-4">
        Developed with ❤️ by{" "}
        <a
          href="https://instagram.com/webjuncture"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:underline"
        >
          @webjuncture
        </a>
      </div>
    </footer>
  );
}
