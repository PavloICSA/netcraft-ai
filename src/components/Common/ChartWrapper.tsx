import React from 'react';

interface ChartWrapperProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for charts with consistent styling
 */
const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border border-secondary-200 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <div className="w-full h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChartWrapper;