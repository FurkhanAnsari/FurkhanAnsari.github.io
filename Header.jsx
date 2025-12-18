import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, Search, Settings, ChevronDown } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800">
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-900 border border-dark-800 focus-within:border-primary-500/50 transition-colors">
            <Search className="w-4 h-4 text-dark-400" />
            <input 
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-dark-400 w-48 lg:w-64"
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 rounded bg-dark-800 text-xs text-dark-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-dark-950" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-dark-900 border border-dark-800 shadow-xl animate-slide-down">
                <div className="p-4 border-b border-dark-800">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="p-4 text-center text-dark-400">
                  <p className="text-sm">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3 pl-2 ml-2 border-l border-dark-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
            </div>
            <button className="flex items-center gap-1 p-1 rounded-lg hover:bg-dark-800 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold shadow-glow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-dark-400 hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

