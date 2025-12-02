"use client";
import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "../../hooks/useDirection";
import navLinksData from "@/data/headerInfo.json";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { isRTL, textAlign } = useDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // קבלת הנתונים לפי השפה הנוכחית
  const navLinks = navLinksData[i18n.language as keyof typeof navLinksData] || navLinksData.he;
  
  const toggleLanguage = () => {};
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className={`w-full bg-white shadow-md sticky top-0 z-50 ${textAlign}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* IDF Green accent line */}
      <div className="w-full h-1 bg-brand-green"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/assets/logo.png"
                alt={t('header.title')}
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <div className="font-he font-bold text-xl text-gray-900">
                  {t('header.title')}
                </div>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-he text-gray-700 hover:text-green-700 px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Right Side */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="hidden md:block text-sm text-gray-600 hover:text-green-700 transition-colors duration-200"
            >
              <LanguageSwitcher />
            </button>
            {/* CTA Buttons */}
            <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <Link
                href="/signup"
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md text-sm font-he font-medium transition-colors duration-200"
              >
                {t('header.soldierRegistration')}
              </Link>
              <Link
                href="/donate"
                className="border border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-5 py-2 rounded-md text-sm font-he font-medium transition-all duration-200"
              >
                {t('header.donation')}
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-green-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-he text-gray-700 hover:text-green-700 px-3 py-2 text-base"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-green-700 text-white px-3 py-2 rounded-md text-center font-he font-medium"
                >
                  {t('header.soldierRegistration')}
                </Link>
                <Link
                  href="/donate"
                  onClick={() => setIsMenuOpen(false)}
                  className="block border border-green-700 text-green-700 px-3 py-2 rounded-md text-center font-he font-medium"
                >
                  {t('header.donation')}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="block w-full text-center text-sm text-gray-600 py-2"
                >
                  <LanguageSwitcher />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;