'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const [showContent, setShowContent] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // שלבי האנימציה
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowIcon(true), 800);
    setTimeout(() => setShowTitle(true), 2000);
    setTimeout(() => setShowMessage(true), 3000);
    setTimeout(() => setShowButtons(true), 4000);
  }, []);

  const handleTryAgain = () => {
    router.push('/donate');
  };

  const handleContact = () => {
    // גלילה לפוטר
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-gray-50/50"></div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Error Icon */}
        <div className="mb-8 md:mb-12">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${showContent ? 'scale-100' : 'scale-0'}`}>
            <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" viewBox="0 0 24 24" fill="none">
              <path 
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-1000 ${showIcon ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  strokeDasharray: '50',
                  strokeDashoffset: showIcon ? '0' : '50',
                  transition: 'stroke-dashoffset 1.5s ease-in-out'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-4xl w-full">
          
          {/* Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 font-he transition-all duration-1000 leading-tight ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
              אופס! משהו השתבש
            </h1>
            <div className={`h-0.5 bg-red-600 mx-auto transition-all duration-1000 ${showTitle ? 'w-16' : 'w-0'}`}></div>
          </div>

          {/* Main Message */}
          <div className={`bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16 text-center transition-all duration-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <div className="space-y-6 md:space-y-8">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed font-he">
                התשלום לא הושלם בהצלחה
              </p>

              <div className="space-y-4 text-gray-700">
                <p className="text-base sm:text-lg md:text-xl leading-relaxed font-he">
                  ייתכן שהייתה בעיה טכנית או שהתשלום בוטל
                </p>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-he">
                  אל תדאג - לא חויבת בכלום
                </p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 md:mt-12 transition-all duration-1000 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={handleTryAgain}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg font-he transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              נסה שוב
            </button>
            
            <button
              onClick={handleContact}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg font-he transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              צור קשר
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}