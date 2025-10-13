"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { ClientSideStrings } from "../translations/ClientSideTranslations";

const COOKIE_NAME = "user_cookie_consent";

export default function CookieConsent() {
    const {cookiepopup} = ClientSideStrings()
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_NAME);
    if (!consent) {
      setTimeout(() => setShowModal(true), 1000); 
    }
  }, []);

  const handleAccept = () => {
    Cookies.set(COOKIE_NAME, "accepted", { expires: 365 });
    setShowModal(false);
  };

  const handleReject = () => {
    Cookies.set(COOKIE_NAME, "rejected", { expires: 365 });
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="fixed bottom-4 left-4 right-4 max-w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 z-50 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
               {cookiepopup.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
               {cookiepopup.valuedescription}
              </p>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                {cookiepopup.term}{" "}
                <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                 {cookiepopup.privacyPolicy}
                </a>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3">
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {cookiepopup.reject}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg transition-colors shadow-md"
                >
                                  {cookiepopup.accept}
                </button>
              </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}