'use client';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TeamChat from '../components/TeamChat';

export default function TeamChatPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#5f4b8b] to-[#4a3a6e] overflow-hidden">
      {/* Main Container */}
      <div className="flex w-full max-h-screen">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col rounded-tl-4xl rounded-bl-4xl bg-white overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          {/* Header Component */}
          <Header />

          {/* Content Container */}
          <div className="flex-1 flex">
            {/* Chat List Sidebar */}
            <div className="w-72 bg-white border-r border-[#E9E5F0]">
              <div className="p-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-[#F8F7FA] text-sm px-4 py-2.5 focus:outline-none rounded-lg focus:ring-2 focus:ring-[#5D4C8E]/20"
                  />
                  <svg className="w-4 h-4 text-[#8B7FB1] absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="px-3">
                {[
                  { name: 'Team Alpha', active: true, unread: 3 },
                  { name: 'Project Discussion', active: false, unread: 0 },
                  { name: 'Design Team', active: false, unread: 5 },
                  { name: 'General Chat', active: false, unread: 0 }
                ].map((chat, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-center rounded-lg gap-3 p-3 mb-1 transition-all duration-200 ${
                      chat.active 
                        ? 'bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] text-white' 
                        : 'hover:bg-[#F3F0F9] text-[#2D2D2D]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B7AED6] to-[#8B7FB1] flex items-center justify-center text-white font-medium">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{chat.name}</div>
                      <div className={`text-xs ${chat.active ? 'text-white/80' : 'text-[#8B7FB1]'}`}>
                        3 members active
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-[#5D4C8E] text-white text-xs flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1">
              <TeamChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}