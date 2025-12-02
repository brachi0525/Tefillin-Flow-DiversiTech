"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const SoldierSuccess = () => {
  const { t } = useTranslation();
  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-green-50 px-4 py-12">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-2xl w-full text-center">
        <CheckCircle
          size={80}
          className="text-green-600 mb-6 animate-bounce"
        />
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          {t("soldierRegistration.messages.registrationSuccess")}
        </h1>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          {t("thank-you.shura1")}
          <br />
          {t("thank-you.shura2")}
          <br />
          {t("thank-you.shura3")}
        </p>
        <Link
          href="/"
          className="inline-block bg-green-700 hover:bg-green-800 transition-colors duration-200 text-white text-lg font-medium px-6 py-3 rounded-md shadow"
        >
          {t("thank-you.returnHome")}
        </Link>
      </div>
    </div>
  );
};

export default SoldierSuccess;
