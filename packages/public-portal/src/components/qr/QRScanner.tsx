import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
const QRScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunning = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [detected, setDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [started, setStarted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stopScanner = async () => {
    try {
      if (scannerRef.current && isScannerRunning.current) {
        await scannerRef.current.stop();
        isScannerRunning.current = false;
      }
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error("שגיאה בעת עצירת הסורק:", err);
    }
  };
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  useEffect(() => {
    if (!started) return;
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    setError(null);
    const readerId = `reader-${Date.now()}`;
    const readerDiv = document.createElement('div');
    readerDiv.id = readerId;
    readerDiv.className = "w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover";
    if (containerRef.current) {
      containerRef.current.appendChild(readerDiv);
    }
    const scanner = new Html5Qrcode(readerId);
    scannerRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          if (!isScannerRunning.current) return;
          isScannerRunning.current = false;
          setDetected(true);
          setIsScanning(false);
          setTimeout(() => {
            if (decodedText.startsWith("http")) {
              window.location.assign(decodedText);
            } else {
              window.location.assign(decodedText);
            }
            stopScanner();
          }, 500);
        },
        () => {
          setIsScanning(true);
          resetTimeout();
          timeoutRef.current = window.setTimeout(() => setIsScanning(false), 300);
        }
      )
      .then(() => {
        isScannerRunning.current = true;
      })
      .catch((err: any) => {
        console.error("שגיאה בהפעלת הסורק:", err);
        if (
          err.name === "NotAllowedError" ||
          (typeof err.message === "string" && err.message.toLowerCase().includes("permission"))
        ) {
          setError("הגישה למצלמה נדחתה. נא לאשר גישה למצלמה כדי לסרוק קוד QR.");
        } else if (
          err.name === "NotFoundError" ||
          (typeof err.message === "string" && err.message.toLowerCase().includes("not found"))
        ) {
          setError("לא נמצאה מצלמה פעילה במכשיר.");
        } else {
          setError("אירעה שגיאה בעת הפעלת המצלמה.");
        }
      });
    return () => {
      resetTimeout();
      stopScanner();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [started]);
  const getStatus = () => {
    if (error) return { color: "text-red-600", bg: "bg-red-100", text: error };
    if (detected) return { color: "text-primary", bg: "bg-primary/20", text: "קוד זוהה בהצלחה!" };
    if (isScanning) return { color: "text-secondary", bg: "bg-secondary/20", text: "סורק..." };
    return { color: "text-gray-500", bg: "bg-gray-100", text: "מוכן לסריקה" };
  };
  const status = getStatus();
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className={`w-72 h-72 border-4 rounded-xl relative bg-white shadow-lg ${
          error ? "border-red-500 shadow-red-300" : "border-primary shadow-primary/40"
        }`}
      >
        <div
          ref={containerRef}
          className="w-full h-full relative"
        />
        {detected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              ✓
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 text-center">מקם את הקוד במרכז המסגרת</p>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.bg} ${status.color}`}>
        <div className={`w-2 h-2 rounded-full ${status.color}`} />
        <span className={`text-xs font-medium ${status.color}`}>{status.text}</span>
      </div>
    </div>
  );
};
export default QRScanner;