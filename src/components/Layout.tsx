import { Link, useLocation } from 'react-router-dom';
import { 
  Upload, 
  BarChart3, 
  BookOpen, 
  Search, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useSarifStore } from '../store/sarifStore';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { sarifData } = useSarifStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const hasData = !!sarifData;

  const navigation = [
    { name: 'Upload', href: '/', icon: Upload, enabled: true },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, enabled: hasData },
    { name: 'Rules', href: '/rules', icon: BookOpen, enabled: hasData },
    { name: 'Findings', href: '/findings', icon: Search, enabled: hasData },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 xl:w-96 bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200/50 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 xl:h-20 px-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 xl:w-7 xl:h-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-lg xl:text-xl font-bold text-white">SARIF</h1>
              <p className="text-sm xl:text-base text-blue-100">Security Visualizer</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          {/* Navigation Header */}
          <div className="mb-4 px-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h2>
            <div className="mt-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>
          
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const enabled = item.enabled;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center py-3 xl:py-4 text-sm xl:text-base font-semibold transition-all duration-300 relative overflow-hidden
                    ${active 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 mx-3 px-4 rounded-xl' 
                      : enabled 
                        ? 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md hover:scale-[1.01] rounded-lg mx-2 px-4' 
                        : 'text-gray-400 cursor-not-allowed opacity-60 rounded-lg mx-2 px-4'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                  style={{ pointerEvents: enabled ? 'auto' : 'none' }}
                >
                  <div className={`p-2 xl:p-3 rounded-lg mr-3 xl:mr-4 ${active ? 'bg-white/20 shadow-md' : 'bg-gray-100 group-hover:bg-blue-100 group-hover:shadow-sm'} transition-all duration-300`}>
                    <Icon className={`h-5 w-5 xl:h-6 xl:w-6 transition-all duration-300 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'}`} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {!enabled && !hasData && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full font-medium">
                      No data
                    </span>
                  )}
                  {enabled && !active && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-xs text-gray-600 text-center space-y-1">
            <p className="font-semibold">SARIF 2.1.0 Compatible</p>
            <p className="text-gray-500">Built with React & TypeScript</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600">System Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80 xl:pl-96">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SARIF Visualizer</span>
          </div>
          <div className="w-12"></div> {/* Spacer for balance */}
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
