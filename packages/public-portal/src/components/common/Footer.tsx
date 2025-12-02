"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useDirection } from "../../hooks/useDirection";
import footerData from "@/data/footerInfo.json";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign } = useDirection();
  
  // קבלת הנתונים לפי השפה הנוכחית
  const footerInfo = footerData[i18n.language as keyof typeof footerData] || footerData.he;
  const { links, contactInfo } = footerInfo;

  return (
    <footer className={`w-full bg-gray-900 text-white ${textAlign}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Green accent line */}
      <div className="w-full h-1 bg-green-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Links Section */}
          <div>
            <h4 className="font-he font-bold mb-6 text-xl text-white flex items-center gap-2">
              {t('footer.infoTitle')}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-he text-gray-300 hover:text-green-400 transition-colors duration-200 text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-he font-bold mb-6 text-xl text-white flex items-center gap-2">
              {t('footer.contactTitle')}
            </h4>
            <ul className="space-y-4">
              <li className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="bg-green-600 rounded-full p-2">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-base">{contactInfo.email}</span>
              </li>
              <li className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="bg-green-600 rounded-full p-2">
                  <FaPhone className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-base">{contactInfo.phone}</span>
              </li>
              <li className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="bg-green-600 rounded-full p-2">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-base">{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Logo & Description */}
          <div>
            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <img
                src="/assets/logo.png"
                alt={t('footer.title')}
                className="h-12 w-auto"
              />
              <div>
                <div className="font-he font-bold text-xl text-white">
                  {t('footer.title')}
                </div>
                <div className="font-he text-sm text-green-400">
                  {t('footer.subtitle')}
                </div>
              </div>
            </div>
            <p className="font-he text-gray-300 text-base leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Copyright */}
            <div className={`font-he text-sm text-gray-400 text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              © {new Date().getFullYear()} {t('footer.copyright')}{contactInfo.name}
            </div>

            {/* Social Media */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="font-he text-sm text-gray-300">{t('footer.followUs')}</span>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-he font-medium transition-colors duration-200"
              >
                {t('footer.registration')}
              </Link>
              <Link
                href="/donate"
                className="border border-green-500 text-green-400 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-he font-medium transition-all duration-200"
              >
                {t('footer.donationHeart')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
