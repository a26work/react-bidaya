import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export const Navbar = () => {
  const { user } = useAuth();
  const { mode, toggleTheme, toggleSidebar, toggleLanguage, direction } = useTheme();
  const { t } = useTranslation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              icon={<Bars3Icon className="h-5 w-5" />}
              className={direction === 'rtl' ? 'ml-4' : 'mr-4'}
            />

            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('app_name')}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              icon={<LanguageIcon className="h-5 w-5" />}
              title={t('language')}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={
                mode === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )
              }
              title={mode === 'dark' ? t('light_mode') : t('dark_mode')}
            />

            <Button
              variant="ghost"
              size="sm"
              icon={<BellIcon className="h-5 w-5" />}
              title={t('notifications')}
            />

            <Button
              variant="ghost"
              size="sm"
              icon={<Cog6ToothIcon className="h-5 w-5" />}
              title={t('settings')}
            />

            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || t('user')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.username || ''}
                </p>
              </div>

              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
