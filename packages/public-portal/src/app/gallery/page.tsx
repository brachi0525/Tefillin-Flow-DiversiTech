"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import BasicPageLayout from "@/layouts/BasicPageLayout";
import media from "../../../../../locales/media.json"; // כאן הטעינה של ה-JSON

interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "image" | "video";
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
}

export default function StoriesSection() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

 useEffect(() => {
  const items: MediaItem[] = (media.items || []).map((item) => ({
    ...item,
    type: item.type === "video" ? "video" : "image",
  }));
  setMediaItems(items);
}, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredItems = mediaItems.filter(
    (item) =>
      item.title?.includes(searchQuery) ||
      item.description?.includes(searchQuery)
  );

  const maxItems = isMobile ? 3 : 6;
  const visibleItems = showAll
    ? filteredItems
    : filteredItems.slice(0, maxItems);

  return (
    <BasicPageLayout>
      <section className="bg-[#F9F7F4] py-20 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          רגעים של אור
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          בזכותכם – חיילים מרחבי הארץ קיבלו תפילין. תודה שאתם חלק מהמסע הזה
        </p>
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="חפש לפי כותרת או תיאור"
              className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full text-right text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 104.49 8.976l4.387 4.386a.75.75 0 101.06-1.06l-4.386-4.387A5.5 5.5 0 009 3.5zm0 1.5a4 4 0 110 8 4 4 0 010-8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden shadow-lg group mx-auto max-w-xs sm:max-w-sm md:max-w-md w-full"
            >
              {item.type === "video" && item.url.includes("drive.google.com") ? (
                <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
                  <iframe
                    src={item.url}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none"
                    loading="lazy"
                  ></iframe>
                </div>
              ) : item.type === "video" ? (
                <video
                  controls
                  className="w-full h-64 sm:h-80 md:h-96 object-cover bg-black"
                >
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <img
  src={item.url}
  alt={item.title || "סיפור"}
  className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
  referrerPolicy="no-referrer"
/>

              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-6 text-white">
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex items-end text-white text-sm leading-relaxed pointer-events-none">
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          {showAll ? (
            <button
              onClick={() => setShowAll(false)}
              className="btn btn-outline text-lg px-6 py-3"
            >
              סגור סיפורים
            </button>
          ) : (
            filteredItems.length > maxItems && (
              <button
                onClick={() => setShowAll(true)}
                className="btn btn-outline text-lg px-6 py-3"
              >
                ← לכל הסיפורים
              </button>
            )
          )}
        </div>
      </section>
    </BasicPageLayout>
  );
}
