import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export const Sidebar = ({ navigationItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { sidebarCollapsed, direction, toggleSidebar } = useTheme();
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState(['kpi']);

  const handleNavigation = (href) => {
    navigate(href);
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

const findItemByPath = (items, pathname) => {
  for (const item of items) {
    if (item.href === pathname) return item;
    if (item.children?.length) {
      const child = item.children.find((c) => c.href === pathname);
      if (child) return child;
    }
  }
  return null;
};

const currentItem = findItemByPath(navigationItems, location.pathname);
const currentPage = currentItem?.id ?? null;

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Logo area */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('app_name')}
            </span>
          )}
          {sidebarCollapsed && (
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">
                {t('app_name').charAt(0).toUpperCase() || 'K'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const itemName = item.nameKey;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const hasActiveChild =
              hasChildren &&
              item.children.some((child) => currentPage === child.id);

            if (hasChildren) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={clsx(
                      'w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      hasActiveChild
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                    title={sidebarCollapsed ? itemName : undefined}
                  >
                    <Icon
                      className={clsx(
                        'flex-shrink-0 h-5 w-5',
                        hasActiveChild ? 'text-blue-500' : 'text-gray-400',
                        sidebarCollapsed ? 'mx-auto' : direction === 'rtl' ? 'ml-3' : 'mr-3',
                      )}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className={direction === 'rtl' ? "truncate flex-1 text-right" : "truncate flex-1 text-left"}>
                          {itemName}
                        </span>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>

                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = currentPage === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleNavigation(child.href)}
                            className={clsx(
                              'w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors',
                              isChildActive
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            )}
                          >
                            <span className="truncate">{child.nameKey}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={clsx(
                  'w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
                title={sidebarCollapsed ? itemName : undefined}
              >
                <Icon
                  className={clsx(
                    'flex-shrink-0 h-5 w-5',
                    isActive ? 'text-blue-500' : 'text-gray-400',
                    sidebarCollapsed ? 'mx-auto' : direction === 'rtl' ? 'ml-3' : 'mr-3',
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{itemName}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <button
              onClick={logout}
              className={clsx(
                'w-full flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700'
              )}
              title={sidebarCollapsed ? t('logout') : undefined}
            >
              <ArrowRightOnRectangleIcon
                className={clsx(
                  'flex-shrink-0 h-5 w-5 text-red-500',
                  sidebarCollapsed ? 'mx-auto' : direction === 'rtl' ? 'ml-3' : 'mr-3',
                )}
              />
              {!sidebarCollapsed && (
                <span className="truncate">{t('logout')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
