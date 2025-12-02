"use client";
import React, { useState } from 'react';
import useSWR from "swr";
import { ChevronDown, ChevronUp } from 'lucide-react';


type FAQItem = {
  question: string;
  answer: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FAQ: React.FC = () => {

  const { data: faqData = [], error } = useSWR<FAQItem[]>("/data/faq.json", fetcher, {
    refreshInterval: 30000,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">שאלות נפוצות</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              dir="rtl"
              key={index}
              className="border border-gray-200 rounded-2xl shadow-sm transition-all duration-300  "
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-right text-lg font-medium text-gray-800 hover:bg-gray-50"
                onClick={() => toggle(index)}
              >
                {item.question}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>


              {isOpen && (
                <div className="px-6 pb-4 text-gray-600 text-sm transition-all duration-300">
                  {item.answer}
                </div>
              )}

            </div>
          );
        })}
      </div>


    </div>
  );
};

export default FAQ;

