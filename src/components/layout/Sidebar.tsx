'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Map, 
  Truck, 
  AlertTriangle, 
  BarChart3,
  Leaf,
  LogOut
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Empresas', href: '/dashboard/empresas', icon: Building2 },
  { name: 'Bombonas', href: '/dashboard/bombonas', icon: Package },
  { name: 'Mapa', href: '/dashboard/mapa', icon: Map },
  { name: 'Coletas', href: '/dashboard/coletas', icon: Truck },
  { name: 'Alertas', href: '/dashboard/alertas', icon: AlertTriangle },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-white">IoWaste</h1>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-4 border-green-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 w-5 h-5" />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-green-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Link
              href="/login"
              className="text-gray-400 hover:text-gray-600 ml-2"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}