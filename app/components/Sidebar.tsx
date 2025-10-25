import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-[230px] flex flex-col py-6 text-white bg-gradient-to-b from-[#5f4b8b] to-[#4a3a6e]">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-[#ff9a56] to-[#ff6b6b] rounded-full  flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 6v5c0 5 7 8 7 8s7-3 7-8V6l-7-4z"/>
          </svg>
        </div>
        <span className="text-lg font-semibold">LB Calendar</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">


        <a href="/" className="flex items-center gap-4 px-3 py-3 text-white hover:bg-white/10  transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[15px] font-semibold">Calendar</span>
        </a>

        
        <a href="/dashboard" className="flex items-center gap-4 px-3 py-3 text-white transition-colors hover:bg-white/10 ">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="text-[15px] font-medium">Overview</span>
        </a>

        <a href="/projects" className="flex items-center gap-4 px-3 py-3 text-white/90 hover:text-white hover:bg-white/10  transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[15px] font-medium">Project</span>
        </a>


        <a href="/team-chat" className="flex items-center gap-4 px-3 py-3 text-white/90 hover:text-white hover:bg-white/10  transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[15px] font-medium">Team Chat</span>
        </a>

        <a href="/settings" className="flex items-center gap-4 px-3 py-3 text-white/90 hover:text-white hover:bg-white/10  transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[15px] font-medium">Settings</span>
        </a>
      </nav>

      {/* Go PRO Section */}
      <div className="mt-15 bg-[#4A3A6E]  w-50 p-4">
        <h3 className="text-white font-bold text-sm mb-2">Hello World</h3>
        <p className="text-xs text-white/80 leading-relaxed mb-5">
          connecte with other team working on this project
        </p>
        <button className="w-full bg-gradient-to-r from-[#FFA756] to-[#FF8542] text-white py-2.5  text-xs font-bold shadow-lg hover:shadow-xl transition-all mb-4">
          Logout
        </button>
        
        {/* Illustration */}
        <div className="flex justify-center">
          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
            {/* Person sitting */}
            <g>
              {/* Shadow */}
              <ellipse cx="50" cy="85" rx="25" ry="4" fill="#3D2F5F" opacity="0.4"/>
              
              {/* Legs */}
              <rect x="40" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              <rect x="52" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              
              {/* Body */}
              <rect x="38" y="40" width="24" height="24" rx="3" fill="#FFA756"/>
              
              {/* Arms */}
              <rect x="30" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              <rect x="62" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              
              {/* Head */}
              <circle cx="50" cy="28" r="9" fill="#D4A574"/>
              
              {/* Hair */}
              <path d="M 42 25 Q 42 18 50 18 Q 58 18 58 25 Q 58 32 50 33 Q 42 32 42 25 Z" fill="#3D2F60"/>
              
              {/* Laptop */}
              <rect x="38" y="56" width="24" height="14" rx="2" fill="#7B6BA8"/>
              <rect x="40" y="58" width="20" height="10" rx="1" fill="#9D8DC8"/>
              
              {/* Laptop base highlight */}
              <rect x="42" y="60" width="16" height="6" rx="0.5" fill="#B8A8D8" opacity="0.5"/>
            </g>
          </svg>
        </div>
      </div>
    </aside>
  );
}


