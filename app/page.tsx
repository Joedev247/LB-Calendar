import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import TeamChat from './components/TeamChat';

export default function Home() {
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
          <div className="flex flex-1 min-h-0">
            {/* Calendar Section */}
            <div className="flex-1 bg-white h-screen overflow-hidden">
              {/* Calendar + Tasks Container */}
              <div className="p-8 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  {/* Calendar Component */}
                  <Calendar />

                  {/* Task List Component */}
                  <TaskList />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-[800px] h-screen bg-white p-8 px-6 overflow-y-auto">
              {/* Notification Component */}
              <Notification />

              {/* Team Chat Component */}
              <TeamChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
