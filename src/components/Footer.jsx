import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d0764 100%)' }} className="text-white">
      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: '#D4AF37' }}>R&S Jewellery</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Premium quality imitation jewellery at prices you'll love. From traditional Kundan to modern designs — because you deserve to shine every day.
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="https://instagram.com/rands.jewellery" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="https://twitter.com" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Twitter size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4" style={{ color: '#D4AF37' }}>Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/shop" className="block text-gray-300 hover:text-amber-400 transition-colors">All Products</Link>
                <Link to="/shop?category=necklaces" className="block text-gray-300 hover:text-amber-400 transition-colors">Necklaces</Link>
                <Link to="/shop?category=earrings" className="block text-gray-300 hover:text-amber-400 transition-colors">Earrings</Link>
                <Link to="/shop?category=bangles" className="block text-gray-300 hover:text-amber-400 transition-colors">Bangles & Bracelets</Link>
                <Link to="/shop?category=rings" className="block text-gray-300 hover:text-amber-400 transition-colors">Rings</Link>
                <Link to="/shop?category=sets" className="block text-gray-300 hover:text-amber-400 transition-colors">Bridal Sets</Link>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-lg mb-4" style={{ color: '#D4AF37' }}>Customer Service</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block text-gray-300 hover:text-amber-400 transition-colors">About Us</Link>
                <Link to="/contact" className="block text-gray-300 hover:text-amber-400 transition-colors">Contact Us</Link>
                <Link to="/shipping" className="block text-gray-300 hover:text-amber-400 transition-colors">Shipping & Delivery</Link>
                <Link to="/returns" className="block text-gray-300 hover:text-amber-400 transition-colors">Returns & Exchanges</Link>
                <Link to="/faq" className="block text-gray-300 hover:text-amber-400 transition-colors">FAQ</Link>
                <Link to="/size-guide" className="block text-gray-300 hover:text-amber-400 transition-colors">Size Guide</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4" style={{ color: '#D4AF37' }}>Get in Touch</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={16} style={{ color: '#D4AF37' }} />
                  <span>+91 83100 96351</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={16} style={{ color: '#D4AF37' }} />
                  <span>rs.jewellery.shop@gmail.com</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin size={16} style={{ color: '#D4AF37' }} className="mt-0.5" />
                  <span>Shop No. 127, Kurubarahalli<br />Sathyanarayan Layout, Bangalore 560086</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <h5 className="font-semibold mb-2 text-sm" style={{ color: '#D4AF37' }}>Subscribe for Offers</h5>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-lg text-sm text-gray-900 bg-white/90 focus:bg-white outline-none"
                  />
                  <button className="p-2 rounded-lg transition-colors" style={{ background: 'linear-gradient(135deg, #D4AF37, #b8960c)' }}>
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ background: '#0f0420', borderTop: '1px solid rgba(212,175,55,0.2)' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © 2026 R&S Imitation Jewellery. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
              <Link to="/refund" className="hover:text-amber-400 transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
