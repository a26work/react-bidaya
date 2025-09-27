import { useState } from 'react';

export const Tooltips = ({
  children,
  content,
  placement = 'top',
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const placements = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg whitespace-nowrap pointer-events-none ${placements[placement]} ${className || ''}`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};
