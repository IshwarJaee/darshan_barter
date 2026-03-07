import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Footer = () => (
  <footer className="bg-navy-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <img 
  src={logo}
  alt="DarshanBarter Logo" 
  className="h-9 w-auto object-contain"
  style={{ maxWidth: '160px', filter: 'brightness(0) invert(1)' }}
/>
            </div>
            <span className="text-xl font-bold text-white">DarshanBarter</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Your trusted partner for personal, home, business and education loans. Transparent, fast, and reliable.
          </p>
          <div className="flex gap-3 mt-5">
            {[FiFacebook, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/services', 'Services'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Loan Products */}
        <div>
          <h4 className="text-white font-semibold mb-4">Loan Products</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Personal Loan', 'Home Loan', 'Business Loan', 'Education Loan', 'Vehicle Loan'].map(item => (
              <li key={item}><Link to="/services" className="hover:text-primary-400 transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><FiMapPin className="mt-0.5 text-primary-400 shrink-0" /><span>123, Finance Street, Pune, Maharashtra – 411001</span></li>
            <li className="flex items-center gap-2"><FiPhone className="text-primary-400 shrink-0" /><a href="tel:+91 9112223630" className="hover:text-primary-400">+91 91122 23630</a></li>
            <li className="flex items-center gap-2"><FiMail className="text-primary-400 shrink-0" /><a href="mailto:loans@darshanbarter.com" className="hover:text-primary-400">loans@darshanbarter.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DarshanBarter. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
