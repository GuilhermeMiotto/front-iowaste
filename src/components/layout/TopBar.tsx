'use client';

interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

export default function TopBar({ title, children }: TopBarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}