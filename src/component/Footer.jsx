
import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-gray-800">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
              Tanlia studio
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              A curated multi-vendor boutique marketplace bringing together unique styles from independent sellers around the world. Discover fashion that tells a story.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-4.1-1.05L3 20l1.1-4.7A8.5 8.5 0 1 1 21 11.5z"></path>
                  <path d="M8.5 9.5c.2 2 2 4 4 4.5"></path>
                  <path d="M8.5 8.5c.5-.5 1-.5 1.3 0l.8 1.2c.2.3.2.6 0 .9l-.5.5"></path>
                </svg>
              </a>

              {/* Mail */}
              <a
                href="mailto:contact@maisonbelle.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                <Mail className="w-4 h-4 stroke-[1.8]" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Shop
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-gray-400">
              <li><button className="hover:text-white transition-colors">All Products</button></li>
              <li><button className="hover:text-white transition-colors">Modest Wear</button></li>
              <li><button className="hover:text-white transition-colors">Sarees</button></li>
              <li><button className="hover:text-white transition-colors">Collections</button></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Company
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-gray-400">
              <li><button className="hover:text-white transition-colors">Sellers</button></li>
              <li><button className="hover:text-white transition-colors">About Us</button></li>
              <li><button className="hover:text-white transition-colors">Contact</button></li>
              <li><button className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Legal
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-gray-400">
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light gap-4">
          <p>© 2026 Tanlia Studio. All rights reserved.</p>
          <p>Curated with care for the discerning shopper</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
