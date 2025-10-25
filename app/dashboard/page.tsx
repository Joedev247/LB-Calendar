'use client';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#5f4b8b] to-[#4a3a6e] p-5 overflow-hidden">
      {/* Main Container */}
      <div className="flex w-full max-h-[calc(100vh-2.5rem)]">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          {/* Header Component */}
          <Header />

          {/* Content Container */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold text-[#2D2D2D] mb-6">Dashboard Overview</h1>
            
            {/* Dashboard Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-gradient-to-br from-[#B7AED6] to-[#8B7FB1] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-white mb-4">Total Projects</h3>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-sm text-white/90 mt-2">+2 from last month</p>
              </div>

              <div className="bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-white/90 mb-4">Upcoming Deadlines</h3>
                <p className="text-3xl font-bold text-white">5</p>
                <p className="text-sm text-white/80 mt-2">Next: Project Alpha</p>
              </div>

              <div className="bg-gradient-to-br from-[#9985C7] to-[#7B68AD] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-white mb-4">Team Members</h3>
                <p className="text-3xl font-bold text-white">8</p>
                <p className="text-sm text-white/90 mt-2">Active today: 6</p>
              </div>

              {/* Recent Activity */}
              <div className="col-span-2 bg-white p-6 sborder border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-[#5D4C8E] mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    "Emily assigned you a new task",
                    "Project meeting scheduled for tomorrow",
                    "Deadline updated for Project Beta",
                    "New team member joined"
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[#4A4A4A] py-2 border-b border-[#F0EDF7]">
                      <div className="w-2 h-2 rounded-full bg-[#5D4C8E]"></div>
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#F3F0F9] to-white p-6 sborder border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-[#5D4C8E] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 shadow-sm">
                    Create New Project
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 shadow-sm">
                    Schedule Meeting
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] bg-white hover:bg-[#5D4C8E] hover:text-white transition-all duration-300 shadow-sm">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}