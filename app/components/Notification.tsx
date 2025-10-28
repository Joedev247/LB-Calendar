import React from "react";

export default function Notification() {
  return (
    <>
      <div className="flex items-center pb-4 justify-between mb-3">
        <h3 className="text-[15px] font-bold">Notification</h3>
        <a
          href="#"
          className="text-[10px] text-black/70 hover:text-black transition-colors font-medium"
        >
          View all
        </a>
      </div>

      <div className="bg-gradient-to-br from-[#5D4C8E] via-[#6856A1] to-[#7A69AA] p-7 text-white relative  overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mb-12"></div>
        <div className="absolute top-1/2 right-4 w-24 h-24 border-[8px] border-white/10 rounded-full"></div>

          <div className="flex items-start gap-7 relative z-10">
            <div className="p-2.5 bg-white/20 rounded-full flex-shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold mb-1.5 leading-snug">
                Emily just sent you task to assign
              </p>
              <p className="text-[10px] text-white/70 mb-3 font-medium">
                Aug 1, 2020 at 09:00 PM
              </p>
              <button className="bg-gradient-to-r from-[#FFB76B] to-[#FFA043] text-white text-[11px] px-4 py-1.5  font-semibold hover:shadow-lg transition-all">
                Assign now
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
