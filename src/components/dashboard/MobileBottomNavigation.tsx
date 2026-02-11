import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { mobileBottomNavItems } from '../../data/navigation';

interface MobileBottomNavigationProps {
  onMenuClick: () => void;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  onMenuClick
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/teachers/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
      <div className="flex justify-around items-stretch h-16">
        {mobileBottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const activeColor = item.special ? 'text-greyed-blue' : 'text-greyed-navy';
          const indicatorColor = item.special ? 'bg-greyed-blue' : 'bg-greyed-navy';

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 touch-manipulation relative ${
                active ? activeColor : 'text-premium-neutral-400 active:text-premium-neutral-500'
              }`}
              aria-label={item.label}
            >
              {active && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 ${indicatorColor} rounded-full`} />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[11px] mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}

        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center flex-1 text-premium-neutral-400 active:text-premium-neutral-500 transition-all duration-200 touch-manipulation"
          aria-label="Menu"
        >
          <Menu size={22} strokeWidth={2} />
          <span className="text-[11px] mt-1 font-medium">More</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
