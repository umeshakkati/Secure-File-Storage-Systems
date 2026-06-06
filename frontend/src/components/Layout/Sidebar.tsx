import React from 'react';
import { Files, Upload, BarChart3, HardDrive, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'files', label: 'My Files', icon: Files },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'storage', label: 'Storage', icon: HardDrive },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 lg:mt-8">
          <div className="px-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              File Management
            </h2>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={`sidebar-item ${
                        activeTab === item.id
                          ? 'sidebar-item-active'
                          : 'sidebar-item-inactive'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8 px-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Future Features
            </h2>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400">
                  <div className="mr-3 h-5 w-5 rounded bg-gray-200 flex-shrink-0"></div>
                  <span className="truncate">IPFS Storage</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                    Soon
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-400">
                  <div className="mr-3 h-5 w-5 rounded bg-gray-200 flex-shrink-0"></div>
                  <span className="truncate">Blockchain</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
                    Soon
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
