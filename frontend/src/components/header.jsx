import { Bell, User, BookOpen, BarChart3, FileText, Home, Compass } from 'lucide-react';

const Header = ({ userName, notificationCount = 3 }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              ASIGUBB
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
              <Home className="w-4 h-4" />
              <span className="font-medium">Inicio</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Compass className="w-4 h-4" />
              <span className="font-medium">Explorar Apuntes</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Mis Apuntes</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <User className="w-4 h-4" />
              <span className="font-medium">Perfil</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">Estadísticas</span>
            </a>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;