'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const [donation, setDonation] = useState<any>({});
  const [showContent, setShowContent] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showSpecialText, setShowSpecialText] = useState(false);
  const [countdown, setCountdown] = useState(12);
  const router = useRouter();

useEffect(() => {
  const timer = setInterval(() => {
    setCountdown((prev) => Math.max(prev - 1, 0));
  }, 1200);

  const donationData = JSON.parse(localStorage.getItem('lastDonation') || '{}');
  console.log('Donation data from localStorage:', donationData);
  setDonation(donationData);

  // שלבי האנימציה
  setTimeout(() => setShowContent(true), 300);
  setTimeout(() => setShowCheckmark(true), 800);
  setTimeout(() => setShowTitle(true), 2500);
  setTimeout(() => setShowMessage(true), 4000);
  setTimeout(() => setShowSpecialText(true), 5500);

  // שליחת מייל
  if (donationData && donationData.email && donationData.amount) {
    fetch('/api/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    }).then(() => {
      console.log('Receipt sent successfully');
      localStorage.removeItem('lastDonation');
    });
  }

  return () => clearInterval(timer); // ← הזזת ה־clearInterval לכאן
}, [router]);
useEffect(() => {
  if (countdown === 0) {
    router.push('/');
  }
}, [countdown, router]);

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-beige/50"></div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Success Icon */}
        <div className="mb-8 md:mb-12">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-1000 ${showContent ? 'scale-100' : 'scale-0'}`}>
            <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" viewBox="0 0 24 24" fill="none">
              <path 
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="checkmark-path"
                style={{
                  strokeDasharray: '50',
                  strokeDashoffset: showCheckmark ? '0' : '50',
                  transition: 'stroke-dashoffset 2s ease-in-out'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-4xl w-full">
          
          {/* Title - רגיל בלי אפקט כתיבה */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 font-he transition-all duration-1000 leading-tight ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
              תודה {donation.fullName || donation.name || 'תורם יקר'}
            </h1>
            <div className={`h-0.5 bg-green-600 mx-auto transition-all duration-1000 ${showTitle ? 'w-16' : 'w-0'}`}></div>
          </div>

          {/* Main Message */}
          <div className={`bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16 text-center transition-all duration-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-6 md:mb-8 font-he">
              תרומתך על סך 
              <span className="font-bold text-green-600 mx-1 md:mx-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl block sm:inline mt-2 sm:mt-0">
                {donation.amount || donation.sum || '0'} ₪
              </span>
              <span className="block sm:inline">התקבלה בהצלחה</span>
            </p>

            <div className="space-y-4 md:space-y-6 text-gray-700">
              {/* השורה המיוחדת עם אפקט כתיבה */}
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-he">
                {showSpecialText && (
                  <>
                    {/* Desktop - שורה אחת */}
                    <div className="hidden md:block">
                      <span className="typewriter-text-desktop">
                        בזכותך, עוד חיילי צה״ל יקבלו תפילין ויוכלו להתחבר למסורת היהודית
                      </span>
                    </div>
                    
                    {/* Mobile - שתי שורות */}
                    <div className="md:hidden space-y-1">
                      <div>
                        <span className="typewriter-text-mobile-1">
                          בזכותך, עוד חיילי צה״ל  
                        </span>
                      </div>
                      <div>
                        <span className="typewriter-text-mobile-2">
                          יוכלו להתחבר למסורת היהודית
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-green-700 font-medium font-he transition-all duration-1000 delay-[6000ms] ${showSpecialText ? 'opacity-100' : 'opacity-0'}`}>
הנך מועבר/ת לדף הבית</p>
            </div>

          </div>

        </div>

      </div>

      {/* CSS for typewriter effects */}
      <style jsx>{`
        .typewriter-text-desktop {
          display: inline-block;
          overflow: hidden;
          border-left: 3px solid #15803d;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.03em;
          animation: 
            typing-desktop 4s steps(60, end) forwards,
            blink-caret 0.8s step-end infinite;
          width: 0;
          max-width: fit-content;
        }

        .typewriter-text-mobile-1 {
          display: inline-block;
          overflow: hidden;
          border-left: 2px solid #15803d;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.02em;
          animation: 
            typing-mobile-1 2.5s steps(35, end) forwards,
            blink-caret-mobile-1 2.5s step-end forwards;
          width: 0;
          max-width: fit-content;
        }

        .typewriter-text-mobile-2 {
          display: inline-block;
          overflow: hidden;
          border-left: 2px solid transparent;
          white-space: nowrap;
          margin: 0;
          letter-spacing: 0.02em;
          animation: 
            typing-mobile-2 2.5s steps(35, end) forwards,
            blink-caret-mobile-2 2.5s step-end infinite;
          width: 0;
          max-width: fit-content;
          animation-delay: 2.5s;
        }

        @keyframes typing-desktop {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes typing-mobile-1 {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes typing-mobile-2 {
          0% { width: 0; }
          100% { width: 100%; }
        }

        /* סמן לדסקטופ */
        @keyframes blink-caret {
          0%, 50% { border-color: #15803d; }
          51%, 100% { border-color: transparent; }
        }

        /* סמן לשורה ראשונה במובייל - נעלם אחרי 2.5 שניות */
        @keyframes blink-caret-mobile-1 {
          0%, 49% { border-color: #15803d; }
          50%, 99% { border-color: transparent; }
          100% { border-color: transparent; }
        }

        /* סמן לשורה שנייה במובייל - מופיע רק כשהיא מתחילה */
        @keyframes blink-caret-mobile-2 {
          0% { border-color: #15803d; }
          50% { border-color: transparent; }
          51% { border-color: #15803d; }
          100% { border-color: transparent; }
        }
      `}</style>

    </div>
  );
}