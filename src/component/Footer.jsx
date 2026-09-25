
import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1816] text-[#D8D2CB]">

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* =========================
            MAIN FOOTER
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 py-16 sm:py-20">

          {/* BRAND */}
          <div className="lg:col-span-5">

            <Link
              to="/"
              className="inline-block text-2xl sm:text-3xl font-serif tracking-[0.08em] text-[#FDFBF7] hover:text-[#D28A68] transition-colors"
            >
              Tanlia Studio
            </Link>

            <p className="mt-6 max-w-sm text-sm text-[#AAA39C] font-light leading-relaxed">
              A thoughtfully curated marketplace bringing together
              independent boutiques and distinctive collections in one
              beautiful place.
            </p>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/tanliastudio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="mt-7 inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#D8D2CB] hover:text-[#D28A68] transition-colors"
            >
              <span className="w-9 h-9 border border-[#514B46] flex items-center justify-center hover:border-[#D28A68] transition-colors">

                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-[1.6]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                  />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line
                    x1="17.5"
                    y1="6.5"
                    x2="17.51"
                    y2="6.5"
                  />
                </svg>

              </span>

              <span>Follow Tanlia</span>

              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>

          {/* SHOP */}
          <div className="lg:col-span-2">

            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#FDFBF7] mb-6">
              Shop
            </h3>

            <ul className="space-y-4 text-sm font-light">

              <li>
                <Link
                  to="/products"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/collections"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  to="/sellers"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Boutique Sellers
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Wishlist
                </Link>
              </li>

            </ul>

          </div>

          {/* COMPANY */}
          <div className="lg:col-span-2">

            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#FDFBF7] mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-sm font-light">

              <li>
                <Link
                  to="/about"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/track-order"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  to="/sellers"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Become a Seller
                </Link>
              </li>

            </ul>

          </div>

          {/* INFORMATION */}
          <div className="lg:col-span-3">

            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#FDFBF7] mb-6">
              Information
            </h3>

            <ul className="space-y-4 text-sm font-light">

              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#D28A68] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <a
                  href="mailto:tanliastudio@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-[#D28A68] transition-colors"
                >
                  <Mail className="w-4 h-4 stroke-[1.5]" />
                  Email Tanlia
                </a>
              </li>

            </ul>

          </div>

        </div>

        {/* =========================
            BOTTOM BAR
        ========================= */}

        <div className="border-t border-[#393531] py-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#817A74] font-light">

          <p className="text-center sm:text-left">
            © 2026 Tanlia Studio. All rights reserved.
          </p>

          <p className="text-center sm:text-right">
            Curated with care.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
