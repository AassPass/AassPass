import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0b161c] text-white px-6 w-full py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
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

      {/* Social Icons */}
      <div className="mt-10 flex justify-center space-x-6 text-white text-xl">
        <a
          href="https://facebook.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:text-blue-600 transition-colors"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://twitter.com/yourhandle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-blue-400 transition-colors"
        >
          <FaTwitter />
        </a>

        <a
          href="https://instagram.com/yourhandle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-pink-500 transition-colors"
        >
          <FaInstagram />
        </a>

        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-blue-700 transition-colors"
        >
          <FaLinkedinIn />
        </a>
      </div>

      {/* Bottom Divider */}
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-white/60 text-xs">
        Made with ❤️ in your city – connect with your local world on{" "}
        <span className="text-blue-400 font-semibold">AassPass</span>.
      </div>
    </footer>
  );
}
