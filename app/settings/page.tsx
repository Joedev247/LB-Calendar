'use client';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Settings() {
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
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#2D2D2D]">Settings</h1>
                  <p className="text-[#8B7FB1] mt-1">Manage your account settings and preferences</p>
                </div>
                <button className="bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e] text-white px-6 py-2.5 font-medium hover:shadow-lg transition-shadow duration-300">
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Profile Settings */}
                <div className="col-span-1 space-y-6">
                  <div className="bg-white p-6 border border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative group">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e] rounded-full flex items-center justify-center text-white text-xl font-bold">
                          JD
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-lg shadow-md flex items-center justify-center text-[#5D4C8E] hover:bg-[#F3F0F9] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Profile Settings</h2>
                        <p className="text-sm text-[#8B7FB1]">Manage your personal information</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 bg-[#F8F7FA] border border-[#E9E5F0] text-[#2D2D2D] placeholder-[#8B7FB1] focus:outline-none focus:ring-2 focus:ring-[#5D4C8E]/20 transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2.5 bg-[#F8F7FA] border border-[#E9E5F0] text-[#2D2D2D] placeholder-[#8B7FB1] focus:outline-none focus:ring-2 focus:ring-[#5D4C8E]/20 transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Role
                        </label>
                        <select className="w-full px-4 py-2.5 bg-[#F8F7FA] border border-[#E9E5F0] text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#5D4C8E]/20 transition-all duration-300">
                          <option value="manager">Project Manager</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Notification Settings */}
                <div className="col-span-1 space-y-6">
                  <div className="bg-gradient-to-br from-white to-[#F3F0F9] p-6 border border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B7AED6] to-[#8B7FB1] rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Notifications</h2>
                        <p className="text-sm text-[#8B7FB1]">Choose what you want to be notified about</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Email Notifications", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                        { name: "Push Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
                        { name: "Calendar Reminders", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { name: "Team Chat Alerts", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
                        { name: "Project Updates", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white transition-colors duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F3F0F9] flex items-center justify-center text-[#5D4C8E]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={setting.icon} />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-[#2D2D2D]">{setting.name}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                            <div className="w-11 h-6 bg-[#E9E5F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-[#E9E5F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#5f4b8b] to-[#4a3a6e]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Theme and Security */}
                <div className="col-span-1 space-y-6">
                  <div className="bg-white p-6 border border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#9985C7] to-[#7B68AD] rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Theme</h2>
                        <p className="text-sm text-[#8B7FB1]">Customize your interface</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Purple Dream', from: '#5f4b8b', to: '#4a3a6e' },
                          { name: 'Ocean Blue', from: '#4A90E2', to: '#357ABD' },
                          { name: 'Forest Green', from: '#48BB78', to: '#38A169' },
                          { name: 'Sunset Red', from: '#F56565', to: '#C53030' }
                        ].map((theme, i) => (
                          <button
                            key={i}
                            className={`p-4 border-2 transition-all duration-300 ${
                              i === 0 ? 'border-[#5D4C8E] shadow-lg' : 'border-transparent hover:border-[#E9E5F0]'
                            }`}
                          >
                            <div className={`w-full h-8 rounded-full mb-2 bg-gradient-to-r from-[${theme.from}] to-[${theme.to}]`}></div>
                            <span className="text-sm font-medium text-[#2D2D2D]">{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-[#F3F0F9] p-6 border border-[#E9E5F0] shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e] rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#2D2D2D] mb-1">Security</h2>
                        <p className="text-sm text-[#8B7FB1]">Protect your account</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Change Password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
                        { name: 'Two-Factor Authentication', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                        { name: 'Login History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[#2D2D2D] hover:bg-white hover:shadow-sm transition-all duration-200"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F3F0F9] flex items-center justify-center text-[#5D4C8E]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}