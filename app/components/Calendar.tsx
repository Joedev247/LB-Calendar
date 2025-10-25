'use client';

import React, { useState } from 'react';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(19);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = 2020;
  const month = 7; // August (0-indexed)
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className='max-w-[500px]'>
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-[18px] font-bold text-gray-900 flex items-center  gap-2">
          August, 2020
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h2>
        <button className="hover:bg-gray-50 mx-5  transition-colors">
          <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
            <circle cy="12" cx="5" r="1.5"/>
            <circle cy="12" cx="12" r="1.5"/>
            <circle cy="12" cx="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-5">
        <div className="grid grid-cols-7 ">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-[9px] pl-4 font-semibold text-gray-400 uppercase">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && setSelectedDate(day)}
              disabled={day === null}
              className={`
                w-[52px] h-[52px] flex items-center justify-center rounded-full text-[12px] font-semibold transition-all
                ${day === null ? 'invisible' : ''}
                ${day === 19 ? 'bg-gradient-to-br from-[#FFB76B] to-[#FFA043] text-white shadow-md hover:shadow-lg' : ''}
                ${day && day !== 19 ? 'hover:bg-gray-50 text-gray-700' : ''}
                ${selectedDate === day && day !== 19 ? 'bg-gray-100' : ''}
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


