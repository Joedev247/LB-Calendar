import React from 'react';

export default function Header() {
  return (
    <div className="bg-gray-100 flex items-center justify-between px-8 py-4 border-b border-gray-100 w-full">
      <div className="flex items-center gap-2.5">
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
        <span className="text-gray-400 text-[13px] font-medium">Welcome, Dominica!</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-50  transition-colors relative">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2.5">
          <img 
            src="https://ui-avatars.com/api/?name=D&background=FFA540&color=fff&size=32&bold=true" 
            alt="User" 
            className="w-8 h-8 rounded-full ring-2 ring-orange-100 shadow-sm"
          />
          <span className="text-[12px] font-medium text-gray-500">dominica@welha.com</span>
        </div>
      </div>
    </div>
  );
}


