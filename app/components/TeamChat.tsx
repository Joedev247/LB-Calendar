"use client";

import React from "react";

export default function TeamChat() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Chat Header */}
      <div className="shrink-0 py-4 border-b border-[#E9E5F0] mx-7 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e] flex items-center justify-center text-white font-medium">
              TA
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#2D2D2D]">Team Alpha</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-[#8B7FB1]">5 members online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['J', 'S', 'M', 'K', 'R'].map((initial, i) => (
                i < 3 ? (
                  <img
                    key={i}
                    src={`https://ui-avatars.com/api/?name=${initial}&background=${
                      ['5D4C8E', '6B5A9C', '4A90E2'][i]
                    }&color=fff&size=32&bold=true`}
                    alt={`User ${initial}`}
                    className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-[#F3F0F9]"
                  />
                ) : i === 3 ? (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-[#F3F0F9] bg-[#F3F0F9] flex items-center justify-center text-xs font-bold text-[#5D4C8E]">
                    +2
                  </div>
                ) : null
              ))}
            </div>
            <button className="bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] text-white text-sm px-4 py-1 rounded font-medium hover:shadow-lg transition-shadow duration-300">
              Invite
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-[#F8F7FA] p-6 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Date Separator */}
          <div className="flex items-center gap-4 opacity-60">
            <div className="flex-1 h-px bg-[#E9E5F0]"></div>
            <span className="text-xs text-[#8B7FB1] font-medium">Today</span>
            <div className="flex-1 h-px bg-[#E9E5F0]"></div>
          </div>

          {/* Messages */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <img
                src="https://ui-avatars.com/api/?name=J&background=5D4C8E&color=fff&size=32&bold=true"
                alt="user"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#2D2D2D]">John Doe</span>
                  <span className="text-xs text-[#8B7FB1]">2 minutes ago</span>
                </div>
                <div className="inline-block bg-white rounded-2xl rounded-tl-none px-5 py-3 text-sm text-[#4A4A4A] shadow-sm">
                  Hey <span className="font-semibold text-[#5D4C8E]">@team</span>, how's the project going? 🚀
                </div>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-3">
              <img
                src="https://ui-avatars.com/api/?name=D&background=FFA540&color=fff&size=32&bold=true"
                alt="dominica"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#8B7FB1]">2 minutes ago</span>
                  <span className="font-medium text-[#2D2D2D]">Dominica Lee</span>
                </div>
                <div className="inline-block bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] rounded-2xl rounded-tr-none px-5 py-3 text-sm text-white shadow-sm">
                  I'm working on the user research phase 📊
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img
                src="https://ui-avatars.com/api/?name=A&background=4A90E2&color=fff&size=32&bold=true"
                alt="user"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#2D2D2D]">Alex Wilson</span>
                  <span className="text-xs text-[#8B7FB1]">just now</span>
                </div>
                <div className="inline-block bg-white rounded-2xl rounded-tl-none px-5 py-3 text-sm text-[#4A4A4A] shadow-sm">
                  <span className="font-semibold text-[#5D4C8E]">@dominica</span> Let me know if you need any help! 👋
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="shrink-0 bg-white px-6 py-4 border-t border-[#E9E5F0]">
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-[#8B7FB1] hover:text-[#5D4C8E] hover:bg-[#F3F0F9] rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-5 py-3 bg-[#F8F7FA] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D4C8E]/20 placeholder:text-[#8B7FB1]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-1.5 text-[#8B7FB1] hover:text-[#5D4C8E]  transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-1.5 text-[#8B7FB1] hover:text-[#5D4C8E]  transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <button className="p-2.5 bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] text-white rotate-90 rounded-full hover:shadow-lg transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
