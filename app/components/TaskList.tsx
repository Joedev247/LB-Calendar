'use client';

import React, { useState } from 'react';

interface Task {
  name: string;
  time: string;
  completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { name: 'Working on Asia Project', time: '09:00-10:00 AM', completed: false },
    { name: 'Team Meeting', time: '10:00-12:00 AM', completed: false },
    { name: 'Doing Research', time: '12:00-04:00 PM', completed: false }
  ]);

  const toggleTask = (idx: number) => {
    setTasks(tasks.map((task, i) => 
      i === idx ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="max-w-[500px]">
      <div className="flex items-center mx-5 justify-between mb-4">
        <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
          Today Task
          <span className="text-[12px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
            {tasks.length}
          </span>
        </h3>
        <button className="p-1.5 hover:bg-gray-50  transition-colors">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 bg-gray-100 p-5 mx-5 ">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-3.5 hover:bg-gray-50/50  transition-colors py-2 px-1">
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(idx)}
              className="w-[17px] h-[17px] rounded-[4px] border-2 border-gray-300 text-[#5D4C8E] focus:ring-[#5D4C8E] focus:ring-offset-0 cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-[14px] font-medium text-gray-700">{task.name}</p>
            </div>
            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{task.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


