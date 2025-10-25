'use client';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Projects() {
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Projects</h1>
              <button className="bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] text-white px-6 py-2.5 text-sm font-medium hover:shadow-lg transition-shadow duration-300">
                + New Project
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  name: "Project Alpha",
                  status: "In Progress",
                  progress: 75,
                  dueDate: "Nov 15, 2025",
                  team: 4
                },
                {
                  name: "Project Beta",
                  status: "Planning",
                  progress: 25,
                  dueDate: "Dec 1, 2025",
                  team: 6
                },
                {
                  name: "Project Gamma",
                  status: "Review",
                  progress: 90,
                  dueDate: "Oct 30, 2025",
                  team: 3
                },
                {
                  name: "Project Delta",
                  status: "On Hold",
                  progress: 50,
                  dueDate: "Nov 20, 2025",
                  team: 5
                },
                {
                  name: "Project Epsilon",
                  status: "Planning",
                  progress: 10,
                  dueDate: "Dec 15, 2025",
                  team: 4
                },
                {
                  name: "Project Zeta",
                  status: "In Progress",
                  progress: 60,
                  dueDate: "Nov 25, 2025",
                  team: 7
                }
              ].map((project, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-[#F3F0F9] p-6 border border-[#E9E5F0] shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-[#2D2D2D]">{project.name}</h3>
                    <span className={`text-xs px-3 py-1.5 rounded-full ${
                      project.status === "In Progress" ? "bg-[#5D4C8E] text-white" :
                      project.status === "Review" ? "bg-[#B7AED6] text-[#4a3a6e]" :
                      project.status === "Planning" ? "bg-[#F3F0F9] text-[#5D4C8E]" :
                      "bg-[#E9E5F0] text-[#8B7FB1]"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-[#4A4A4A] mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F3F0F9] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            project.progress >= 80 ? "bg-gradient-to-r from-[#5f4b8b] to-[#7B68AD]" :
                            project.progress >= 50 ? "bg-gradient-to-r from-[#7B68AD] to-[#9985C7]" :
                            "bg-gradient-to-r from-[#9985C7] to-[#B7AED6]"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B7FB1]">Due Date</span>
                      <span className="text-[#2D2D2D] font-medium">{project.dueDate}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B7FB1]">Team Size</span>
                      <span className="text-[#2D2D2D] font-medium">{project.team} members</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}