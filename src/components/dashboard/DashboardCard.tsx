import React from 'react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerBorder?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  headerBorder = true,
}) => {
  return (
    <section
      className={`bg-white rounded-2xl border border-[#E2E8E5] shadow-[0_2px_12px_rgba(6,35,75,0.03)] overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div
          className={`px-5 py-4 sm:px-6 sm:py-4.5 flex flex-wrap items-center justify-between gap-3 ${
            headerBorder ? 'border-b border-[#E2E8E5]/70' : ''
          }`}
        >
          <div>
            {title && (
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#06234B] tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#5C6B78] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
};
